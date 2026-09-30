import api from "./api";

export const login = async (email, password) => {
    const response = await api.post(
        "/api/auth/login",
        {
            email,
            password
        }
    );

    return response.data;
};

export const refreshAccessToken = async () => {
    const refreshToken =
        localStorage.getItem("refreshToken");

    if (!refreshToken) {
        throw new Error("No refresh token found");
    }

    const response = await api.post(
        "/api/auth/refresh",
        {
            refreshToken
        }
    );

    const accessToken =
        response.data?.data?.accessToken;

    if (!accessToken) {
        throw new Error(
            "No access token returned during refresh"
        );
    }

    localStorage.setItem(
        "accessToken",
        accessToken
    );

    return accessToken;
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};