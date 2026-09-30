import express from "express";

import { getStats } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authenticate, getStats);

export default router;