import {
    loginUser,
    refreshAccessToken
} from "../services/authService.js";
export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
        }

        const result =
            await refreshAccessToken(refreshToken);

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: result
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const result = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
        },
    });
};