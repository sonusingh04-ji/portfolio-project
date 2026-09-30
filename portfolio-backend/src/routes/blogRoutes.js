import express from "express";

import {
    getAllPublishedBlogs,
    getPublishedBlogById,
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
} from "../controllers/blogController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllPublishedBlogs);

// Admin
router.get("/admin", authenticate, getAllBlogs);

router.get("/:id", getPublishedBlogById);

router.post("/", authenticate, createBlog);
router.put("/:id", authenticate, updateBlog);
router.delete("/:id", authenticate, deleteBlog);

export default router;