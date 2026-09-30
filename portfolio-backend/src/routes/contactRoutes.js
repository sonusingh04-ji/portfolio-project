import express from "express";

import {
    createContactMessage,
    getAllMessages,
    updateMessageStatus,
    deleteMessage
} from "../controllers/contactController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public contact form
router.post(
    "/",
    createContactMessage
);

// Admin - get all messages
router.get(
    "/messages",
    authenticate,
    getAllMessages
);

// Admin - update message status
router.put(
    "/messages/:id/status",
    authenticate,
    updateMessageStatus
);

// Admin - delete message
router.delete(
    "/messages/:id",
    authenticate,
    deleteMessage
);

export default router;