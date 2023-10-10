import  { Request, Response } from 'express';
import Connection from "../Database/Connection";
import Model from "../Helper/Model";
import {ValidationError, validationResult} from "express-validator";
import apiResponse from "../Helper/apiResponse";
import HelperFunction from "../Helper/HelperFunction";



const AuthController = {
    login: (req: Request, res: Response) => {
        console.log('ok');
        return apiResponse.success(res, 'Login is Successful', []);
    },
    register: (req: Request, res: Response) => {



    },
    verifyPass(req: Request, res: Response) {
        // const query = "SELECT * FROM users where id = 2";
        //
        // const hashPassword = "$2y$10$q0cymLmu.b/nmyfULrahUe2fYG2jAWBvVnrwLJnmfcZ6/1ghvNQDK";
        // const plaintPassword = "Admin#1689s9";
        // const passwordVerify = Model.passwordVerify(plaintPassword, hashPassword);
        //
        // res.json({passwordVerify: passwordVerify});
    }
}

export default AuthController;