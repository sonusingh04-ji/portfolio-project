import pool from "../config/database.js";

export const getAllExperience = async () => {
    const result = await pool.query(`
        SELECT
            id,
            company,
            position,
            location,
            employment_type,
            start_date,
            end_date,
            is_current,
            description,
            technologies,
            display_order,
            created_at,
            updated_at
        FROM experience
        ORDER BY
            is_current DESC,
            start_date DESC,
            display_order ASC
    `);

    return result.rows;
};

export const getExperienceById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            company,
            position,
            location,
            employment_type,
            start_date,
            end_date,
            is_current,
            description,
            technologies,
            display_order,
            created_at,
            updated_at
        FROM experience
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

export const createExperience = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO experience (
            company,
            position,
            location,
            employment_type,
            start_date,
            end_date,
            is_current,
            description,
            technologies,
            display_order
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *
        `,
        [
            data.company,
            data.position,
            data.location || null,
            data.employmentType || null,
            data.startDate,
            data.endDate || null,
            data.isCurrent ?? false,
            data.description || null,
            data.technologies || [],
            data.displayOrder ?? 0
        ]
    );

    return result.rows[0];
};

export const updateExperience = async (id, data) => {
    const result = await pool.query(
        `
        UPDATE experience
        SET
            company = $1,
            position = $2,
            location = $3,
            employment_type = $4,
            start_date = $5,
            end_date = $6,
            is_current = $7,
            description = $8,
            technologies = $9,
            display_order = $10
        WHERE id = $11
        RETURNING *
        `,
        [
            data.company,
            data.position,
            data.location || null,
            data.employmentType || null,
            data.startDate,
            data.endDate || null,
            data.isCurrent ?? false,
            data.description || null,
            data.technologies || [],
            data.displayOrder ?? 0,
            id
        ]
    );

    return result.rows[0] || null;
};

export const deleteExperience = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM experience
        WHERE id = $1
        RETURNING id
        `,
        [id]
    );

    return result.rows[0] || null;
};