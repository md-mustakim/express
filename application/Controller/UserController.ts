import  { Request, Response } from 'express';
import Connection from "../Database/Connection";
const UserController = {
    index: (req: Request, res: Response) => {
        Connection.getConnection().then((connection) => {
            connection.query('SELECT * FROM users', (err: any, rows: any) => {
                if (err) {
                    console.log(err);
                }
                
                res.setHeader('Content-Type', 'application/json');
                res.json(rows);

            });
        });

        // res.send('Login');
    }
}

export default UserController;