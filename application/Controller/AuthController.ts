import  { Request, Response } from 'express';
import Connection from "../Database/Connection";
import Model from "../Helper/Model";
import { query, matchedData, validationResult } from 'express-validator';
import apiResponse from "../Helper/apiResponse";



const AuthController = {
    login: (req: Request, res: Response) => {

        const query = "SELECT * FROM users where id = 2";

          const hashPassword = "$2y$10$q0cymLmu.b/nmyfULrahUe2fYG2jAWBvVnrwLJnmfcZ6/1ghvNQDK";
          const plaintPassword = "Admin#1689s9";
            const passwordVerify = Model.passwordVerify(plaintPassword, hashPassword);

        res.json({passwordVerify: passwordVerify});

    },
    register: (req: Request, res: Response) => {

        let body = req.body;

        let errors:any = [];

        if(body.hasOwnProperty('phone')){
            if(errors.hasOwnProperty('phone')){
                // set phone object
                errors.phone = {
                    msg: 'Phone is required.',
                }

            }
        }

        console.log(req.body);


       apiResponse.success(res, 'Registration is Successful.', [req.body]);
    }
}

export default AuthController;