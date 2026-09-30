import express from "express";

import {
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} from "../controllers/testimonialController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllTestimonials);
router.get("/:id", getTestimonialById);

// Admin protected
router.post("/", authenticate, createTestimonial);
router.put("/:id", authenticate, updateTestimonial);
router.delete("/:id", authenticate, deleteTestimonial);

export default router;