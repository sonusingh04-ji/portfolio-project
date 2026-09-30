import express from "express";
import {
    getAbout,
    updateAbout,
} from "../controllers/aboutController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAbout);

// Admin only
router.put("/", authenticate, updateAbout);

export default router;