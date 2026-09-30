import express from "express";

import {
    getAllExperience,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
} from "../controllers/experienceController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllExperience);
router.get("/:id", getExperienceById);

// Admin protected
router.post("/", authenticate, createExperience);
router.put("/:id", authenticate, updateExperience);
router.delete("/:id", authenticate, deleteExperience);

export default router;