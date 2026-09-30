import express from "express";

import {
    getAllSkills,
    createSkill,
    updateSkill,
    deleteSkill,
} from "../controllers/skillController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllSkills);

// Admin protected
router.post("/", authenticate, createSkill);
router.put("/:id", authenticate, updateSkill);
router.delete("/:id", authenticate, deleteSkill);

export default router;