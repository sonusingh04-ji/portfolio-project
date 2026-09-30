import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "../config/database.js";

dotenv.config();

const createAdmin = async () => {
    try {
        const name = "Portfolio Admin";
        const email = "admin@portfolio.com";
        const password = "Admin@12345";

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            console.log("⚠️ Admin user already exists");
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query(
            `
            INSERT INTO users
            (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            `,
            [name, email, passwordHash, "ADMIN"]
        );

        console.log("✅ Admin user created");
        console.log("Email:", email);
        console.log("Password:", password);

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to create admin:", error.message);
        process.exit(1);
    }
};

createAdmin();