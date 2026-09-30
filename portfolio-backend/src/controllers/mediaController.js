import * as mediaService from "../services/mediaService.js";
import fs from "fs/promises";
import path from "path";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }

        const file = req.file;

        const publicUrl =
            `${process.env.BASE_URL}/uploads/${file.filename}`;

        const media = await mediaService.createMedia({
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            fileSize: file.size,
            storagePath: file.path,
            publicUrl,
            uploadedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: {
                id: media.id,
                originalName: media.original_name,
                fileName: media.file_name,
                mimeType: media.mime_type,
                fileSize: media.file_size,
                publicUrl: media.public_url,
                createdAt: media.created_at
            }
        });
    } catch (error) {
        console.error("Upload Image Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to upload image"
        });
    }
};

export const getAllMedia = async (req, res) => {
    try {
        const media = await mediaService.getAllMedia();

        res.status(200).json({
            success: true,
            count: media.length,
            data: media
        });
    } catch (error) {
        console.error("Get Media Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch media"
        });
    }
};

export const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await mediaService.deleteMedia(id);

        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Media not found"
            });
        }

        try {
            const uploadDirectory =
                path.resolve("uploads");

            const filePath =
                path.resolve(media.storage_path);

            const isInsideUploadDirectory =
                filePath === uploadDirectory ||
                filePath.startsWith(
                    `${uploadDirectory}${path.sep}`
                );

            if (isInsideUploadDirectory) {
                await fs.unlink(filePath);
            }
        } catch (fileError) {
            if (fileError.code !== "ENOENT") {
                console.error(
                    "File deletion error:",
                    fileError.message
                );
            }
        }

        res.status(200).json({
            success: true,
            message: "Media deleted successfully"
        });
    } catch (error) {
        console.error(
            "Delete Media Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete media"
        });
    }
};