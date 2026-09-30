import pool from "../config/database.js";

export const getAbout = async () => {
    const result = await pool.query(`
        SELECT
            id,
            full_name,
            headline,
            bio,
            profile_image_url,
            resume_url,
            location,
            email,
            phone,
            github_url,
            linkedin_url,
            website_url,
            updated_at
        FROM about
        WHERE id = 1
    `);

    return result.rows[0] || null;
};

export const updateAbout = async (data) => {
    const {
        fullName,
        headline,
        bio,
        profileImageUrl,
        resumeUrl,
        location,
        email,
        phone,
        githubUrl,
        linkedinUrl,
        websiteUrl,
    } = data;

    const result = await pool.query(
        `
        INSERT INTO about (
            id,
            full_name,
            headline,
            bio,
            profile_image_url,
            resume_url,
            location,
            email,
            phone,
            github_url,
            linkedin_url,
            website_url
        )
        VALUES (
            1,
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11
        )
        ON CONFLICT (id)
        DO UPDATE SET
            full_name = EXCLUDED.full_name,
            headline = EXCLUDED.headline,
            bio = EXCLUDED.bio,
            profile_image_url = EXCLUDED.profile_image_url,
            resume_url = EXCLUDED.resume_url,
            location = EXCLUDED.location,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            github_url = EXCLUDED.github_url,
            linkedin_url = EXCLUDED.linkedin_url,
            website_url = EXCLUDED.website_url
        RETURNING
            id,
            full_name,
            headline,
            bio,
            profile_image_url,
            resume_url,
            location,
            email,
            phone,
            github_url,
            linkedin_url,
            website_url,
            updated_at
        `,
        [
            fullName,
            headline,
            bio,
            profileImageUrl,
            resumeUrl,
            location,
            email,
            phone,
            githubUrl,
            linkedinUrl,
            websiteUrl,
        ]
    );

    return result.rows[0];
};