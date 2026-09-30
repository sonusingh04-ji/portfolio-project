import * as experienceService from "../services/experienceService.js";

const isValidTechnologies = (technologies) => {
    return (
        technologies === undefined ||
        technologies === null ||
        Array.isArray(technologies)
    );
};

export const getAllExperience = async (req, res) => {
    try {
        const experience =
            await experienceService.getAllExperience();

        res.status(200).json({
            success: true,
            count: experience.length,
            data: experience
        });
    } catch (error) {
        console.error("Get Experience Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch experience"
        });
    }
};

export const getExperienceById = async (req, res) => {
    try {
        const experience =
            await experienceService.getExperienceById(
                req.params.id
            );

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });
        }

        res.status(200).json({
            success: true,
            data: experience
        });
    } catch (error) {
        console.error("Get Experience Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch experience"
        });
    }
};

export const createExperience = async (req, res) => {
    try {
        const {
            company,
            position,
            location,
            employmentType,
            startDate,
            endDate,
            isCurrent,
            description,
            technologies,
            displayOrder
        } = req.body;

        if (!company || !position || !startDate) {
            return res.status(400).json({
                success: false,
                message:
                    "company, position and startDate are required"
            });
        }

        if (!isValidTechnologies(technologies)) {
            return res.status(400).json({
                success: false,
                message: "technologies must be an array"
            });
        }

        if (isCurrent && endDate) {
            return res.status(400).json({
                success: false,
                message:
                    "endDate should not be provided for current experience"
            });
        }

        const experience =
            await experienceService.createExperience({
                company,
                position,
                location,
                employmentType,
                startDate,
                endDate,
                isCurrent,
                description,
                technologies,
                displayOrder
            });

        res.status(201).json({
            success: true,
            message: "Experience created successfully",
            data: experience
        });
    } catch (error) {
        console.error("Create Experience Error:", error);

        if (error.code === "23514") {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid dates: endDate must be after startDate"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create experience"
        });
    }
};

export const updateExperience = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            company,
            position,
            location,
            employmentType,
            startDate,
            endDate,
            isCurrent,
            description,
            technologies,
            displayOrder
        } = req.body;

        if (!company || !position || !startDate) {
            return res.status(400).json({
                success: false,
                message:
                    "company, position and startDate are required"
            });
        }

        if (!isValidTechnologies(technologies)) {
            return res.status(400).json({
                success: false,
                message: "technologies must be an array"
            });
        }

        if (isCurrent && endDate) {
            return res.status(400).json({
                success: false,
                message:
                    "endDate should not be provided for current experience"
            });
        }

        const experience =
            await experienceService.updateExperience(id, {
                company,
                position,
                location,
                employmentType,
                startDate,
                endDate,
                isCurrent,
                description,
                technologies,
                displayOrder
            });

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Experience updated successfully",
            data: experience
        });
    } catch (error) {
        console.error("Update Experience Error:", error);

        if (error.code === "23514") {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid dates: endDate must be after startDate"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update experience"
        });
    }
};

export const deleteExperience = async (req, res) => {
    try {
        const deleted =
            await experienceService.deleteExperience(
                req.params.id
            );

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Experience deleted successfully"
        });
    } catch (error) {
        console.error("Delete Experience Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete experience"
        });
    }
};