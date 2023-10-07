import  { Request, Response } from 'express';
import Connection from "../Database/Connection";
import Query from "../Helper/Query";


const AuthController = {
    login: (req: Request, res: Response) => {

        Query.get('select * from users where id=?', [1]).then((result) => {

            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.send(err);

        });



    }
}

export default AuthController;