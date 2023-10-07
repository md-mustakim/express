import  { Request, Response } from 'express';
import Connection from "../Database/Connection";
import Model from "../Helper/Model";
import { query, matchedData, validationResult } from 'express-validator';



const AuthController = {
    login: (req: Request, res: Response) => {

        const query = "SELECT * FROM users where id = 2";



          const hashPassword = "$2y$10$q0cymLmu.b/nmyfULrahUe2fYG2jAWBvVnrwLJnmfcZ6/1ghvNQDK";
          const plaintPassword = "Admin#1689s9";
            const passwordVerify = Model.passwordVerify(plaintPassword, hashPassword);

        res.json({passwordVerify: passwordVerify});

    },
    register: (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
          }
        const data = matchedData(req);
        res.json({data: data});
    }
}

export default AuthController;