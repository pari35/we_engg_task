
import { AppError } from '../middlewares/erroHandler.js';
import pool from '../utils/db.js';

const registerUser = async (userRegData) => {
    try {
        const { username, emailid, password } = userRegData;

        // check if user with email exists 
        const getUser = `SELECT * FROM users WHERE emailid = $1`;
        const existingUser = await pool.query(getUser, [emailid])

        if (existingUser.rows[0]) {
            throw new AppError('User already exists', 409);
        }

        // SQL query
        const query = `
      INSERT INTO users (username, emailid, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

        // Execute query
        const result = await pool.query(query, [username, emailid, password]);

        console.log("User registered successfully:", result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error("Error registering user:", error.message);
        throw error;
    }


}

export {
    registerUser
}