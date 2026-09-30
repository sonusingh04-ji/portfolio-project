import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import {
    uploadImage,
    getAllMedia,
    deleteMedia
} from "../controllers/mediaController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        const uniqueName =
            `${crypto.randomUUID()}${extension}`;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPEG, PNG, WEBP and GIF images are allowed"
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// Admin protected
router.post(
    "/image",
    authenticate,
    upload.single("image"),
    uploadImage
);

router.get(
    "/media",
    authenticate,
    getAllMedia
);

router.delete(
    "/media/:id",
    authenticate,
    deleteMedia
);

export default router;