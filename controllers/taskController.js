import Joi from 'joi';
import { manageTaskService } from '../services/taskService.js';
import { getTaskService, getMyTaskService, getTaskByIdService } from '../services/taskService.js';

const manageTaskController = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
        task_name: Joi.string().min(3).required().messages({
            'string.empty': 'Task name is required',
            'any.required': 'Task name is required'
        }),
        description: Joi.string().min(5).required().messages({
            'string.empty': 'Description is required',
            'any.required': 'Description is required'
        }),
        status: Joi.string().valid('pending', 'in_progress', 'completed').optional(),
        created_at: Joi.date().optional(),
        created_by: Joi.number().optional()
    });

    // Validate the request body
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    try {
        // Pass validated data to service
        const taskServData = await manageTaskService(req);
        res.status(201).json({
            success: true,
            data: taskServData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const getTaskController = async (req, res) => {
    try {
        // Pass validated data to service
        const getTasks = await getTaskService(req);
        res.status(201).json({
            success: true,
            data: getTasks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }

}

const getMyTaskController = async (req, res) => {
    try {
        const getTasksId = await getMyTaskService(req.user.userid);
        res.status(201).json({
            success: true,
            data: getTasksId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const getTaskByIdController = async (req, res) => {
    try {
        let id = req.params.id
        console.log("get task by id");
        
        const getTasksId = await getTaskByIdService(id);
        res.status(201).json({
            success: true,
            data: getTasksId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

export {
    manageTaskController,
    getTaskController,
    getMyTaskController,
    getTaskByIdController
}