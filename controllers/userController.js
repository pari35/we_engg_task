import Joi from "joi";
import bcrypt from 'bcrypt'
import { loginUserService, registerUserService } from "../services/userService.js";


const registerUserController = async (req, res) => {
    try {
        const schema = Joi.object({
            username: Joi.string().min(3).max(100).required(),
            emailid: Joi.string().email().required(),
            password: Joi.string().min(6).max(255).required(),
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { username, emailid, password } = value;

        const encpassword = await bcrypt.hash(password, 10);

        const user = await registerUserService({
            username,
            emailid,
            password: encpassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (err) {
        console.error("Controller Error:", err);

        return res.status(Number(err.status) || 500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
};


const loginUserController = async (req, res) => {

    let loginUser = await loginUserService(req)

    res.status(201).json(loginUser)

}

export {
    registerUserController,
    loginUserController
}