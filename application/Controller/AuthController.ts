import  { Request, Response } from 'express';
import Connection from "../Database/Connection";
const AuthController = {
    login: (req: Request, res: Response) => {

         res.send(req.body);
    }
}

export default AuthController;