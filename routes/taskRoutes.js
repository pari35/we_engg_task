import express from "express";
import { getMyTaskController, getTaskByIdController, getTaskController, manageTaskController } from "../controllers/taskController.js";

const router = express.Router()

router.post('/tasks', manageTaskController)

router.get('/tasks', getTaskController)

router.get('/getMyTasks', getMyTaskController)

router.get('/task/:id', getTaskByIdController)

router.patch('/task/:id', manageTaskController)

export default router