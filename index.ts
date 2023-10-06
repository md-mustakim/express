import express, { Express, Request, Response } from 'express';
import apiResponse from "./application/Helper/apiResponse";
import AuthController from "./application/Controller/AuthController";
import crypto from 'crypto';


const app: Express = express();
const port = 4000;

app.get('/', (req: Request, res: Response) => {
    // get user ip address
    const ip =  req.ips.length > 0 ? req.ips[0] : req.ip;
    // get user agent
    const userAgent = req.headers['user-agent'] ;
    apiResponse.success(res, { ip: ip, userAgent: userAgent }, 'Success');
});

app.get('/login', AuthController.login);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});