import pool from "../config/database.js";

export const getAllProjects = async () => {
    const result = await pool.query(`
        SELECT
            id,
            title,
            slug,
            description,
            image_url,
            live_url,
            github_url,
            tech_stack,
            featured,
            display_order,
            is_published,
            created_at,
            updated_at
        FROM projects
        ORDER BY featured DESC, display_order ASC, created_at DESC
    `);

    return result.rows;
};

export const getProjectById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            title,
            slug,
            description,
            image_url,
            live_url,
            github_url,
            tech_stack,
            featured,
            display_order,
            is_published,
            created_at,
            updated_at
        FROM projects
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

export const createProject = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO projects (
            title,
            slug,
            description,
            image_url,
            live_url,
            github_url,
            tech_stack,
            featured,
            display_order,
            is_published
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *
        `,
        [
            data.title,
            data.slug,
            data.description,
            data.imageUrl || null,
            data.liveUrl || null,
            data.githubUrl || null,
            data.techStack || [],
            data.featured ?? false,
            data.displayOrder ?? 0,
            data.isPublished ?? true
        ]
    );

    return result.rows[0];
};

export const updateProject = async (id, data) => {
    const result = await pool.query(
        `
        UPDATE projects
        SET
            title = $1,
            slug = $2,
            description = $3,
            image_url = $4,
            live_url = $5,
            github_url = $6,
            tech_stack = $7,
            featured = $8,
            display_order = $9,
            is_published = $10
        WHERE id = $11
        RETURNING *
        `,
        [
            data.title,
            data.slug,
            data.description,
            data.imageUrl || null,
            data.liveUrl || null,
            data.githubUrl || null,
            data.techStack || [],
            data.featured ?? false,
            data.displayOrder ?? 0,
            data.isPublished ?? true,
            id
        ]
    );

    return result.rows[0] || null;
};

export const deleteProject = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM projects
        WHERE id = $1
        RETURNING id
        `,
        [id]
    );

    return result.rows[0] || null;
};