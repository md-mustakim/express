import  { Request, Response } from 'express';

import apiResponse from "../Helper/apiResponse";

const AuthController = {
    login: (req: Request, res: Response) => {
        
        return apiResponse.success(res, 'Login is Successful', []);
    },
    register: (req: Request, res: Response) => {
    },
    verifyPass(req: Request, res: Response) {

    }
}

export default AuthController;