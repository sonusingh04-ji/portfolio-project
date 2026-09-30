import pool from "../config/database.js";

export const createMedia = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO media (
            original_name,
            file_name,
            mime_type,
            file_size,
            storage_path,
            public_url,
            uploaded_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            id,
            original_name,
            file_name,
            mime_type,
            file_size,
            storage_path,
            public_url,
            uploaded_by,
            created_at
        `,
        [
            data.originalName,
            data.fileName,
            data.mimeType,
            data.fileSize,
            data.storagePath,
            data.publicUrl,
            data.uploadedBy
        ]
    );

    return result.rows[0];
};

export const getAllMedia = async () => {
    const result = await pool.query(`
        SELECT
            id,
            original_name,
            file_name,
            mime_type,
            file_size,
            storage_path,
            public_url,
            uploaded_by,
            created_at
        FROM media
        ORDER BY created_at DESC
    `);

    return result.rows;
};
export const deleteMedia = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM media
        WHERE id = $1
        RETURNING
            id,
            file_name,
            storage_path,
            public_url
        `,
        [id]
    );

    return result.rows[0] || null;
};