import express from "express";

import {
    login,
    getMe,
    refresh
} from "../controllers/authController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/refresh", refresh);

router.get(
    "/me",
    authenticate,
    getMe
);

export default router;