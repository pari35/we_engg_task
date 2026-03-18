import { registerUser } from "../repositories/userRepository.js"
import bcrypt from 'bcrypt'
import pool from '../utils/db.js';
import { AppError } from "../middlewares/erroHandler.js";
import jwt from 'jsonwebtoken'
import Joi from 'joi';

const registerUserService = async (userData) => {
    const { username, emailid, password } = userData;

    try {
        // 🔍 Check if user exists
        const getUser = `SELECT * FROM users WHERE emailid = $1`;
        const existingUser = await pool.query(getUser, [emailid]);

        if (existingUser.rows.length > 0) {
            throw new AppError("User already exists", 409);
        }

        // 🧾 Insert user
        const query = `
            INSERT INTO users (username, emailid, password)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const result = await pool.query(query, [username, emailid, password]);

        return result.rows[0];

    } catch (error) {
        console.error("Service Error:", error);

        // ✅ If it's already an AppError → rethrow
        if (error instanceof AppError) {
            throw error;
        }

        // ❗ Handle PostgreSQL unique constraint (extra safety)
        if (error.code === "23505") {
            throw new AppError("User already exists", 409);
        }

        // ❌ Unknown error
        throw new AppError("Internal Server Error", 500);
    }
};

const loginUserService = async (req, res) => {

    const { emailid, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    console.log(`Login attempt from IP: ${ipAddress}`);

    if (emailid) {
        // Mobile login
        if (!password) {
            res.status(401).json("emailid and password are required")
        }

        const result = await authenticate({ emailid, password, ipAddress });
        return result
    }
}


const authenticate = async ({ emailid, password, ipAddress }) => {

    const getUser = `SELECT * FROM users WHERE emailid = $1`;
    const result = await pool.query(getUser, [emailid]);

    if (!result.rows[0]) {
        throw new AppError('Invalid Emailid', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, result.rows[0].password);
    if (!isPasswordValid) {
        throw new AppError('Invalid password', 401);
    }

    // create JWt token
    const token = jwt.sign(
        {
            emailid: emailid,
            userid: result.rows[0].id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h'
        }
    )

    return {
        emailid: emailid,
        token
    }
}

export {
    registerUserService,
    loginUserService
}