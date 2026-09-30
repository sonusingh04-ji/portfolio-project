import * as testimonialService from "../services/testimonialService.js";

const validateRating = (rating) => {
    if (rating === undefined || rating === null || rating === "") {
        return true;
    }

    const numericRating = Number(rating);

    return (
        Number.isInteger(numericRating) &&
        numericRating >= 1 &&
        numericRating <= 5
    );
};

export const getAllTestimonials = async (req, res) => {
    try {
        const testimonials =
            await testimonialService.getAllTestimonials();

        res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials
        });
    } catch (error) {
        console.error("Get Testimonials Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch testimonials"
        });
    }
};

export const getTestimonialById = async (req, res) => {
    try {
        const testimonial =
            await testimonialService.getTestimonialById(
                req.params.id
            );

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error("Get Testimonial Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch testimonial"
        });
    }
};

export const createTestimonial = async (req, res) => {
    try {
        const {
            name,
            role,
            company,
            avatarUrl,
            content,
            rating,
            displayOrder,
            isVisible
        } = req.body;

        if (!name || !content) {
            return res.status(400).json({
                success: false,
                message: "name and content are required"
            });
        }

        if (!validateRating(rating)) {
            return res.status(400).json({
                success: false,
                message: "rating must be an integer between 1 and 5"
            });
        }

        const testimonial =
            await testimonialService.createTestimonial({
                name,
                role,
                company,
                avatarUrl,
                content,
                rating:
                    rating === undefined ||
                    rating === null ||
                    rating === ""
                        ? null
                        : Number(rating),
                displayOrder:
                    displayOrder !== undefined
                        ? Number(displayOrder)
                        : 0,
                isVisible
            });

        res.status(201).json({
            success: true,
            message: "Testimonial created successfully",
            data: testimonial
        });
    } catch (error) {
        console.error("Create Testimonial Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create testimonial"
        });
    }
};

export const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            role,
            company,
            avatarUrl,
            content,
            rating,
            displayOrder,
            isVisible
        } = req.body;

        if (!name || !content) {
            return res.status(400).json({
                success: false,
                message: "name and content are required"
            });
        }

        if (!validateRating(rating)) {
            return res.status(400).json({
                success: false,
                message: "rating must be an integer between 1 and 5"
            });
        }

        const testimonial =
            await testimonialService.updateTestimonial(id, {
                name,
                role,
                company,
                avatarUrl,
                content,
                rating:
                    rating === undefined ||
                    rating === null ||
                    rating === ""
                        ? null
                        : Number(rating),
                displayOrder:
                    displayOrder !== undefined
                        ? Number(displayOrder)
                        : 0,
                isVisible
            });

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Testimonial updated successfully",
            data: testimonial
        });
    } catch (error) {
        console.error("Update Testimonial Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update testimonial"
        });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        const deleted =
            await testimonialService.deleteTestimonial(
                req.params.id
            );

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Testimonial deleted successfully"
        });
    } catch (error) {
        console.error("Delete Testimonial Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete testimonial"
        });
    }
};