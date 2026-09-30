import pool from "../config/database.js";

export const getDashboardStats = async () => {
    const result = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM projects) AS projects,
            (SELECT COUNT(*) FROM blogs) AS blogs,
            (SELECT COUNT(*) FROM experience) AS experience,
            (SELECT COUNT(*) FROM testimonials) AS testimonials,
            (SELECT COUNT(*) FROM services) AS services,
            (SELECT COUNT(*) FROM skills) AS skills,
            (SELECT COUNT(*) FROM media) AS media,
            (SELECT COUNT(*) FROM messages) AS messages,
            (SELECT COUNT(*) FROM messages WHERE status = 'UNREAD') AS unread_messages
    `);

    return result.rows[0];
};