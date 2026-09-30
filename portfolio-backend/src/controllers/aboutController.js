import * as aboutService from "../services/aboutService.js";

export const getAbout = async (req, res) => {
    try {
        const about = await aboutService.getAbout();

        if (!about) {
            return res.status(404).json({
                success: false,
                message: "About content not found",
            });
        }

        res.status(200).json({
            success: true,
            data: about,
        });
    } catch (error) {
        console.error("Get About Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch About content",
        });
    }
};

export const updateAbout = async (req, res) => {
    try {
        const {
            fullName,
            headline,
            bio,
            profileImageUrl,
            resumeUrl,
            location,
            email,
            phone,
            githubUrl,
            linkedinUrl,
            websiteUrl,
        } = req.body;

        if (!fullName || !headline || !bio) {
            return res.status(400).json({
                success: false,
                message: "fullName, headline and bio are required",
            });
        }

        const about = await aboutService.updateAbout({
            fullName,
            headline,
            bio,
            profileImageUrl,
            resumeUrl,
            location,
            email,
            phone,
            githubUrl,
            linkedinUrl,
            websiteUrl,
        });

        res.status(200).json({
            success: true,
            message: "About content updated successfully",
            data: about,
        });
    } catch (error) {
        console.error("Update About Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update About content",
        });
    }
};