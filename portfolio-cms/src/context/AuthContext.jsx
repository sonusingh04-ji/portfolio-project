import { createContext, useContext, useState } from "react";

import {
    login as loginApi,
    logout as logoutApi
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser);
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    });

    const login = async (email, password) => {
        const response = await loginApi(email, password);

        console.log("LOGIN RESPONSE:", response);

        if (!response?.success) {
            throw new Error(
                response?.message || "Login failed"
            );
        }

        const loggedInUser = response.data.user;
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;

        localStorage.setItem(
            "user",
            JSON.stringify(loggedInUser)
        );

        localStorage.setItem(
            "accessToken",
            accessToken
        );

        localStorage.setItem(
            "refreshToken",
            refreshToken
        );

        setUser(loggedInUser);

        return loggedInUser;
    };

    const logout = () => {
        logoutApi();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: Boolean(user)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};