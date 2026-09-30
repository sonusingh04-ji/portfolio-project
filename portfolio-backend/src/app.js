import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header
            // such as curl/Postman/server-to-server requests.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error(`CORS blocked origin: ${origin}`)
            );
        },
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Portfolio CMS backend is running",
        timestamp: new Date().toISOString(),
    });
});

app.use((err, req, res, next) => {
    if (err instanceof Error) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    next(err);
});

app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/services", serviceRoutes);
app.use("/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
export default app;