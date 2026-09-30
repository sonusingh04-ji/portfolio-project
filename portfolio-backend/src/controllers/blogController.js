import * as blogService from "../services/blogService.js";

const validStatuses = ["DRAFT", "PUBLISHED"];
export const getAllPublishedBlogs = async (req, res) => {
    try {
        const blogs = await blogService.getAllPublishedBlogs();

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    } catch (error) {
        console.error("Get Published Blogs Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch published blogs",
        });
    }
};

export const getPublishedBlogById = async (req, res) => {
    try {
        const blog = await blogService.getPublishedBlogById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error("Get Published Blog Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
        });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogService.getAllBlogs();

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    } catch (error) {
        console.error("Get Blogs Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
        });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error("Get Blog Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
        });
    }
};

export const createBlog = async (req, res) => {
    try {
        const {
            title,
            slug,
            excerpt,
            content,
            coverImageUrl,
            tags,
            status,
        } = req.body;

        if (!title || !slug || !content) {
            return res.status(400).json({
                success: false,
                message: "title, slug and content are required",
            });
        }

        if (tags !== undefined && !Array.isArray(tags)) {
            return res.status(400).json({
                success: false,
                message: "tags must be an array",
            });
        }

        const blogStatus = status || "DRAFT";

        if (!validStatuses.includes(blogStatus)) {
            return res.status(400).json({
                success: false,
                message: "status must be DRAFT or PUBLISHED",
            });
        }

        const blog = await blogService.createBlog({
            title,
            slug,
            excerpt,
            content,
            coverImageUrl,
            tags,
            status: blogStatus,
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog,
        });
    } catch (error) {
        console.error("Create Blog Error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A blog with this slug already exists",
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create blog",
        });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            slug,
            excerpt,
            content,
            coverImageUrl,
            tags,
            status,
        } = req.body;

        if (!title || !slug || !content) {
            return res.status(400).json({
                success: false,
                message: "title, slug and content are required",
            });
        }

        if (tags !== undefined && !Array.isArray(tags)) {
            return res.status(400).json({
                success: false,
                message: "tags must be an array",
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "status must be DRAFT or PUBLISHED",
            });
        }

        const blog = await blogService.updateBlog(id, {
            title,
            slug,
            excerpt,
            content,
            coverImageUrl,
            tags,
            status,
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog,
        });
    } catch (error) {
        console.error("Update Blog Error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A blog with this slug already exists",
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update blog",
        });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await blogService.deleteBlog(
            req.params.id
        );

        if (!deletedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.error("Delete Blog Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete blog",
        });
    }
};