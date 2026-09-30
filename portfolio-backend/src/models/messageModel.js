import pool from "../config/database.js";

export const createMessage = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO messages (
            name,
            email,
            subject,
            message
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            data.name,
            data.email,
            data.subject || null,
            data.message
        ]
    );

    return result.rows[0];
};

export const getAllMessages = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            email,
            subject,
            message,
            status,
            created_at
        FROM messages
        ORDER BY created_at DESC
    `);

    return result.rows;
};

export const updateMessageStatus = async (id, status) => {
    const result = await pool.query(
        `
        UPDATE messages
        SET status = $1
        WHERE id = $2
        RETURNING *
        `,
        [status, id]
    );

    return result.rows[0] || null;
};

export const deleteMessage = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM messages
        WHERE id = $1
        RETURNING
            id,
            name,
            email,
            subject,
            message,
            status,
            created_at
        `,
        [id]
    );

    return result.rows[0] || null;
};