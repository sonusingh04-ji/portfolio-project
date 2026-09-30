import pool from "../config/database.js";

export const getAllServices = async () => {
    const result = await pool.query(`
        SELECT
            id,
            title,
            slug,
            description,
            icon,
            display_order,
            is_visible,
            created_at,
            updated_at
        FROM services
        ORDER BY display_order ASC, created_at ASC
    `);

    return result.rows;
};

export const getServiceById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            title,
            slug,
            description,
            icon,
            display_order,
            is_visible,
            created_at,
            updated_at
        FROM services
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

export const createService = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO services (
            title,
            slug,
            description,
            icon,
            display_order,
            is_visible
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            data.title,
            data.slug,
            data.description,
            data.icon || null,
            data.displayOrder ?? 0,
            data.isVisible ?? true
        ]
    );

    return result.rows[0];
};

export const updateService = async (id, data) => {
    const result = await pool.query(
        `
        UPDATE services
        SET
            title = $1,
            slug = $2,
            description = $3,
            icon = $4,
            display_order = $5,
            is_visible = $6
        WHERE id = $7
        RETURNING *
        `,
        [
            data.title,
            data.slug,
            data.description,
            data.icon || null,
            data.displayOrder ?? 0,
            data.isVisible ?? true,
            id
        ]
    );

    return result.rows[0] || null;
};

export const deleteService = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM services
        WHERE id = $1
        RETURNING id
        `,
        [id]
    );

    return result.rows[0] || null;
};