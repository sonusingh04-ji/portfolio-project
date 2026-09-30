import bcrypt from "bcrypt";
import pool from "../config/database.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken
} from "../utils/jwt.js";

export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    let decoded;

    try {
        decoded = verifyToken(refreshToken);
    } catch {
        throw new Error("Invalid or expired refresh token");
    }

    const result = await pool.query(
        `
        SELECT id, name, email, role, is_active
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [decoded.id]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = result.rows[0];

    if (!user.is_active) {
        throw new Error("User account is inactive");
    }

    const accessToken = generateAccessToken(user);

    return {
        accessToken
    };
};

export const loginUser = async (email, password) => {
    const result = await pool.query(
        `
        SELECT id, name, email, password_hash, role, is_active
        FROM users
        WHERE email = $1
        LIMIT 1
        `,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    if (!user.is_active) {
        throw new Error("User account is inactive");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};