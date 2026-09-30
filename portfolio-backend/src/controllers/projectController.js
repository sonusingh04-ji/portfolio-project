import * as projectService from "../services/projectService.js";

export const getAllProjects = async (req, res) => {
    try {
        const projects = await projectService.getAllProjects();

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        console.error("Get Projects Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
        });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await projectService.getProjectById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error("Get Project Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch project"
        });
    }
};

export const createProject = async (req, res) => {
    try {
        const {
            title,
            slug,
            description,
            imageUrl,
            liveUrl,
            githubUrl,
            techStack,
            featured,
            displayOrder,
            isPublished
        } = req.body;

        if (!title || !slug || !description) {
            return res.status(400).json({
                success: false,
                message: "title, slug and description are required"
            });
        }

        if (techStack !== undefined && !Array.isArray(techStack)) {
            return res.status(400).json({
                success: false,
                message: "techStack must be an array"
            });
        }

        const project = await projectService.createProject({
            title,
            slug,
            description,
            imageUrl,
            liveUrl,
            githubUrl,
            techStack,
            featured,
            displayOrder,
            isPublished
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });
    } catch (error) {
        console.error("Create Project Error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A project with this slug already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create project"
        });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            slug,
            description,
            imageUrl,
            liveUrl,
            githubUrl,
            techStack,
            featured,
            displayOrder,
            isPublished
        } = req.body;

        if (!title || !slug || !description) {
            return res.status(400).json({
                success: false,
                message: "title, slug and description are required"
            });
        }

        if (techStack !== undefined && !Array.isArray(techStack)) {
            return res.status(400).json({
                success: false,
                message: "techStack must be an array"
            });
        }

        const project = await projectService.updateProject(id, {
            title,
            slug,
            description,
            imageUrl,
            liveUrl,
            githubUrl,
            techStack,
            featured,
            displayOrder,
            isPublished
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });
    } catch (error) {
        console.error("Update Project Error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A project with this slug already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update project"
        });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const deleted = await projectService.deleteProject(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        console.error("Delete Project Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete project"
        });
    }
};