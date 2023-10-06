import  { Request, Response } from 'express';
import Connection from "../Database/Connection";
import Query from "../Helper/Query";


const AuthController = {
    login: (req: Request, res: Response) => {

        Query.get('SELECT 1 + 1 AS solution').then((result) => {
            res.json([result]);
        }).catch((err) => {
            console.log(err);
            res.send(err);

        });



    }
}

export default AuthController;