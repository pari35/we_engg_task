
import { AppError } from '../middlewares/erroHandler.js';
import pool from '../utils/db.js';

const manageTaskRepo = async (taskData) => {
    try {

        const { task_name, description, status, created_at, createdBy } = taskData;

        // update if taskdata id
        if (taskData.id) {
            const query = `
    UPDATE tasks
    SET 
      task_name = $1,
      description = $2,
      status = $3,
      modified_at = CURRENT_TIMESTAMP
    WHERE task_id = $4
    RETURNING *;
  `;

            const values = [
                task_name,
                description,
                status,
                taskData.id
            ];

            const result = await pool.query(query, values);
            return result.rows[0];
        }

        const query = `
      INSERT INTO tasks (task_name, description, status, created_at, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

        const values = [task_name, description, status, created_at, createdBy];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting task:", error);
        throw error;
    }
};

const getTaskRepo = async (page, limit, search) => {
  try {
    const offset = (page - 1) * limit;

    const query = `
      SELECT *
      FROM tasks
      WHERE 
        task_name ILIKE $1
        OR description ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;

    const values = [`%${search || ''}%`, limit, offset];

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};


const getMyTaskRepo = async (createdBy) => {
  try {
    const query = `
      SELECT *
      FROM tasks
      WHERE created_by = $1
      ORDER BY created_at DESC;
    `;

    const values = [createdBy];

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching tasks by createdBy:", error);
    throw error;
  }
};

const getTaskByIdRepo = async (taskId) => {
  try {
    const query = `
      SELECT *
      FROM tasks
      WHERE task_id = $1;
    `;

    const values = [taskId];

    const result = await pool.query(query, values);
    return result.rows[0]; // single task
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};


export {
    manageTaskRepo,
    getTaskRepo,
    getMyTaskRepo,
    getTaskByIdRepo
}