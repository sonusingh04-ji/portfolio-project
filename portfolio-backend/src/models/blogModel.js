import pool from "../config/database.js";

export const getAllBlogs = async () => {
    const result = await pool.query(`
        SELECT
            id,
            title,
            slug,
            excerpt,
            content,
            cover_image_url,
            tags,
            status,
            published_at,
            created_at,
            updated_at
        FROM blogs
        ORDER BY
            CASE WHEN status = 'PUBLISHED' THEN 0 ELSE 1 END,
            published_at DESC NULLS LAST,
            created_at DESC
    `);

    return result.rows;
};
export const getAllPublishedBlogs = async () => {
    const result = await pool.query(`
        SELECT
            id,
            title,
            slug,
            excerpt,
            content,
            cover_image_url,
            tags,
            status,
            published_at,
            created_at,
            updated_at
        FROM blogs
        WHERE status = 'PUBLISHED'
        ORDER BY
            published_at DESC NULLS LAST,
            created_at DESC
    `);

    return result.rows;
};

export const getBlogById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            title,
            slug,
            excerpt,
            content,
            cover_image_url,
            tags,
            status,
            published_at,
            created_at,
            updated_at
        FROM blogs
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

export const getPublishedBlogById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            title,
            slug,
            excerpt,
            content,
            cover_image_url,
            tags,
            status,
            published_at,
            created_at,
            updated_at
        FROM blogs
        WHERE id = $1
          AND status = 'PUBLISHED'
        `,
        [id]
    );

    return result.rows[0] || null;
};

export const createBlog = async (data) => {
    const {
        title,
        slug,
        excerpt,
        content,
        coverImageUrl,
        tags,
        status,
    } = data;

    const publishedAt =
        status === "PUBLISHED" ? new Date() : null;

    const result = await pool.query(
        `
        INSERT INTO blogs (
            title,
            slug,
            excerpt,
            content,
            cover_image_url,
            tags,
            status,
            published_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
        `,
        [
            title,
            slug,
            excerpt || null,
            content,
            coverImageUrl || null,
            tags || [],
            status || "DRAFT",
            publishedAt,
        ]
    );

    return result.rows[0];
};

export const updateBlog = async (id, data) => {
    const {
        title,
        slug,
        excerpt,
        content,
        coverImageUrl,
        tags,
        status,
    } = data;

    const existing = await pool.query(
        `SELECT published_at FROM blogs WHERE id = $1`,
        [id]
    );

    if (existing.rows.length === 0) {
        return null;
    }

    let publishedAt = existing.rows[0].published_at;

    if (status === "PUBLISHED" && !publishedAt) {
        publishedAt = new Date();
    }

    if (status === "DRAFT") {
        publishedAt = null;
    }

    const result = await pool.query(
        `
        UPDATE blogs
        SET
            title = $1,
            slug = $2,
            excerpt = $3,
            content = $4,
            cover_image_url = $5,
            tags = $6,
            status = $7,
            published_at = $8
        WHERE id = $9
        RETURNING *
        `,
        [
            title,
            slug,
            excerpt || null,
            content,
            coverImageUrl || null,
            tags || [],
            status,
            publishedAt,
            id,
        ]
    );

    return result.rows[0] || null;
};

export const deleteBlog = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM blogs
        WHERE id = $1
        RETURNING id
        `,
        [id]
    );

    return result.rows[0] || null;
};