import * as serviceService from "../services/serviceService.js";

export const getAllServices = async (req, res) => {
    try {
        const services = await serviceService.getAllServices();

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        console.error("Get Services Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch services"
        });
    }
};

export const getServiceById = async (req, res) => {
    try {
        const service = await serviceService.getServiceById(
            req.params.id
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error("Get Service Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch service"
        });
    }
};

export const createService = async (req, res) => {
    try {
        const {
            title,
            slug,
            description,
            icon,
            displayOrder,
            isVisible
        } = req.body;

        if (!title || !slug || !description) {
            return res.status(400).json({
                success: false,
                message:
                    "title, slug and description are required"
            });
        }

        const service = await serviceService.createService({
            title,
            slug,
            description,
            icon,
            displayOrder,
            isVisible
        });

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: service
        });
    } catch (error) {
        console.error("Create Service Error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A service with this slug already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create service"
        });
    }
};

export const updateService = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            slug,
            description,
            icon,
            displayOrder,
            isVisible
        } = req.body;

        if (!title || !slug || !description) {
            return res.status(400).json({
                success: false,
                message:
                    "title, slug and description are required"
            });
        }

        const service = await serviceService.updateService(id, {
            title,
            slug,
            description,
            icon,
            displayOrder,
            isVisible
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service
        });
    } catch (error) {
        console.error("Update Service Error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A service with this slug already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update service"
        });
    }
};

export const deleteService = async (req, res) => {
    try {
        const deleted = await serviceService.deleteService(
            req.params.id
        );

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        console.error("Delete Service Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete service"
        });
    }
};