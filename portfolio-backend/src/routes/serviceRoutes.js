import express from "express";

import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from "../controllers/serviceController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Admin protected
router.post("/", authenticate, createService);
router.put("/:id", authenticate, updateService);
router.delete("/:id", authenticate, deleteService);

export default router;