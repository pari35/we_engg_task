import express from "express";
import { registerUserController } from "../controllers/userController.js";

import userRoutes from './userRoutes.js'
import taskRoutes from './taskRoutes.js' 
import { authMiddleware } from "../middlewares/authMidleware.js";

const router = express.Router()

// make routes
router.use('/user', userRoutes)

router.use('/task', authMiddleware ,taskRoutes)

export default  router 