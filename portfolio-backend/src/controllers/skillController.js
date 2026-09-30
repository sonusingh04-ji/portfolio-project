import * as skillService from "../services/skillService.js";

export const getAllSkills = async (req, res) => {
    try {
        const skills = await skillService.getAllSkills();

        res.status(200).json({
            success: true,
            count: skills.length,
            data: skills,
        });
    } catch (error) {
        console.error("Get Skills Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch skills",
        });
    }
};

export const createSkill = async (req, res) => {
    try {
        const {
            name,
            category,
            proficiency,
            icon,
            displayOrder,
            isVisible,
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required",
            });
        }

        if (
            proficiency !== undefined &&
            proficiency !== null &&
            (Number(proficiency) < 0 || Number(proficiency) > 100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Proficiency must be between 0 and 100",
            });
        }

        const skill = await skillService.createSkill({
            name,
            category,
            proficiency:
                proficiency !== undefined
                    ? Number(proficiency)
                    : null,
            icon,
            displayOrder:
                displayOrder !== undefined
                    ? Number(displayOrder)
                    : 0,
            isVisible,
        });

        res.status(201).json({
            success: true,
            message: "Skill created successfully",
            data: skill,
        });
    } catch (error) {
        console.error("Create Skill Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create skill",
        });
    }
};

export const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            category,
            proficiency,
            icon,
            displayOrder,
            isVisible,
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required",
            });
        }

        if (
            proficiency !== undefined &&
            proficiency !== null &&
            (Number(proficiency) < 0 || Number(proficiency) > 100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Proficiency must be between 0 and 100",
            });
        }

        const skill = await skillService.updateSkill(id, {
            name,
            category,
            proficiency:
                proficiency !== undefined
                    ? Number(proficiency)
                    : null,
            icon,
            displayOrder:
                displayOrder !== undefined
                    ? Number(displayOrder)
                    : 0,
            isVisible,
        });

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Skill updated successfully",
            data: skill,
        });
    } catch (error) {
        console.error("Update Skill Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update skill",
        });
    }
};

export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSkill = await skillService.deleteSkill(id);

        if (!deletedSkill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully",
        });
    } catch (error) {
        console.error("Delete Skill Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete skill",
        });
    }
};