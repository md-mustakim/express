import  { Request, Response } from 'express';
import Connection from "../Database/Connection";
const AuthController = {
    login: (req: Request, res: Response) => {

        Connection.getConnection().then((connection) => {
            connection.query('SELECT * FROM users', (err: any, rows: any) => {
                if (err) {
                    console.log(err);
                }
                console.log(rows);
                res.setHeader('Content-Type', 'application/json');
                res.json(rows);

            });
        });
        // res.send('Login');
    }
}

export default AuthController;