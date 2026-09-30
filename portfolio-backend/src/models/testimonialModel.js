import pool from "../config/database.js";

export const getAllTestimonials = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            role,
            company,
            avatar_url,
            content,
            rating,
            display_order,
            is_visible,
            created_at,
            updated_at
        FROM testimonials
        ORDER BY display_order ASC, created_at DESC
    `);

    return result.rows;
};

export const getTestimonialById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            role,
            company,
            avatar_url,
            content,
            rating,
            display_order,
            is_visible,
            created_at,
            updated_at
        FROM testimonials
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

export const createTestimonial = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO testimonials (
            name,
            role,
            company,
            avatar_url,
            content,
            rating,
            display_order,
            is_visible
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
        `,
        [
            data.name,
            data.role || null,
            data.company || null,
            data.avatarUrl || null,
            data.content,
            data.rating ?? null,
            data.displayOrder ?? 0,
            data.isVisible ?? true
        ]
    );

    return result.rows[0];
};

export const updateTestimonial = async (id, data) => {
    const result = await pool.query(
        `
        UPDATE testimonials
        SET
            name = $1,
            role = $2,
            company = $3,
            avatar_url = $4,
            content = $5,
            rating = $6,
            display_order = $7,
            is_visible = $8
        WHERE id = $9
        RETURNING *
        `,
        [
            data.name,
            data.role || null,
            data.company || null,
            data.avatarUrl || null,
            data.content,
            data.rating ?? null,
            data.displayOrder ?? 0,
            data.isVisible ?? true,
            id
        ]
    );

    return result.rows[0] || null;
};

export const deleteTestimonial = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM testimonials
        WHERE id = $1
        RETURNING id
        `,
        [id]
    );

    return result.rows[0] || null;
};