import express from "express";

import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from "../controllers/projectController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);

router.post("/", authenticate, createProject);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);

export default router;