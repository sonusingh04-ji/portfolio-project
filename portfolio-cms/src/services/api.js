import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5001";

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000
});

/*
 * Attach the current access token
 */
api.interceptors.request.use(
    (config) => {
        const accessToken =
            localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        if (
            typeof FormData !== "undefined" &&
            config.data instanceof FormData
        ) {
            delete config.headers["Content-Type"];
        } else {
            config.headers["Content-Type"] =
                "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/*
 * Automatically refresh an expired access token
 */
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => {
        callback(newToken);
    });

    refreshSubscribers = [];
};

const clearAuthentication = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest?._retry
        ) {
            return Promise.reject(error);
        }

        /*
         * Don't refresh the login/refresh endpoints themselves.
         */
        if (
            originalRequest.url?.includes(
                "/api/auth/login"
            ) ||
            originalRequest.url?.includes(
                "/api/auth/refresh"
            )
        ) {
            clearAuthentication();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken =
            localStorage.getItem("refreshToken");

        if (!refreshToken) {
            clearAuthentication();

            window.location.href = "/login";

            return Promise.reject(error);
        }

        /*
         * Another request may already be refreshing.
         * Wait for it instead of sending multiple refresh requests.
         */
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribeTokenRefresh(
                    (newAccessToken) => {
                        originalRequest.headers.Authorization =
                            `Bearer ${newAccessToken}`;

                        resolve(
                            api(originalRequest)
                        );
                    }
                );

                setTimeout(() => {
                    reject(error);
                }, 10000);
            });
        }

        isRefreshing = true;

        try {
            const refreshResponse =
                await axios.post(
                    `${API_URL}/api/auth/refresh`,
                    {
                        refreshToken
                    },
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            const newAccessToken =
                refreshResponse.data?.data?.accessToken;

            if (!newAccessToken) {
                throw new Error(
                    "Refresh endpoint did not return an access token"
                );
            }

            localStorage.setItem(
                "accessToken",
                newAccessToken
            );

            onRefreshed(newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            clearAuthentication();

            window.location.href = "/login";

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;