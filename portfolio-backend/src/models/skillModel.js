import pool from "../config/database.js";

export const getAllSkills = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            category,
            proficiency,
            icon,
            display_order,
            is_visible,
            created_at,
            updated_at
        FROM skills
        ORDER BY display_order ASC, created_at ASC
    `);

    return result.rows;
};

export const createSkill = async (data) => {
    const {
        name,
        category,
        proficiency,
        icon,
        displayOrder,
        isVisible,
    } = data;

    const result = await pool.query(
        `
            INSERT INTO skills (
                name,
                category,
                proficiency,
                icon,
                display_order,
                is_visible
            )
            VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING
            id,
            name,
            category,
            proficiency,
            icon,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
            name,
            category || null,
            proficiency ?? null,
            icon || null,
            displayOrder ?? 0,
            isVisible ?? true,
        ]
    );

    return result.rows[0];
};

export const updateSkill = async (id, data) => {
    const {
        name,
        category,
        proficiency,
        icon,
        displayOrder,
        isVisible,
    } = data;

    const result = await pool.query(
        `
            UPDATE skills
            SET
                name = $1,
                category = $2,
                proficiency = $3,
                icon = $4,
                display_order = $5,
                is_visible = $6
            WHERE id = $7
                RETURNING
            id,
            name,
            category,
            proficiency,
            icon,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
            name,
            category || null,
            proficiency ?? null,
            icon || null,
            displayOrder ?? 0,
            isVisible ?? true,
            id,
        ]
    );

    return result.rows[0] || null;
};

export const deleteSkill = async (id) => {
    const result = await pool.query(
        `
            DELETE FROM skills
            WHERE id = $1
                RETURNING id
        `,
        [id]
    );

    return result.rows[0] || null;
};