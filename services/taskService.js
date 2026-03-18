import { getMyTaskRepo, getTaskByIdRepo, getTaskRepo, manageTaskRepo } from "../repositories/taskReository.js";

const manageTaskService = async (req) => {
    try {

        const taskData = {
            task_name: req.body.task_name,
            description: req.body.description,
            status: req.body.status,
            created_at: req.body.created_at,
            createdBy: req.user.userid,
            id: req.params.id
        }

        let manageTaskDetails = await manageTaskRepo(taskData)
        return manageTaskDetails
    } catch (err) {
        console.error('Error in manage task service:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

const getTaskService = async (req) => {

    const { page, limit, search } = req.query

    let taskData = await getTaskRepo(page, limit, search)
    return taskData

}


const getMyTaskService = async (id) => {

    let taskByIdData = await getMyTaskRepo(id)
    return taskByIdData
}

const getTaskByIdService = async (id) => {

    let taskByIdData = await getTaskByIdRepo(id)
    return taskByIdData
}

export {
    manageTaskService,
    getTaskService,
    getMyTaskService,
    getTaskByIdService
}