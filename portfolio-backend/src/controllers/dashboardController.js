import {
    getDashboardStats
} from "../services/dashboardService.js";

export const getStats = async (req, res) => {
    try {
        const stats = await getDashboardStats();

        res.status(200).json({
            success: true,
            data: {
                projects: Number(stats.projects),
                blogs: Number(stats.blogs),
                experience: Number(stats.experience),
                testimonials: Number(stats.testimonials),
                services: Number(stats.services),
                skills: Number(stats.skills),
                media: Number(stats.media),
                messages: Number(stats.messages),
                unreadMessages: Number(stats.unread_messages)
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};