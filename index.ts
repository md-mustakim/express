import express, { Express, Request, Response } from 'express';
import apiResponse from "./application/Helper/apiResponse";

import UserAgent from "./application/Helper/UserAgent";
import router from "./application/Router/api/v1/api";


const app: Express = express();
const port = 4000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.get('/', (req: Request, res: Response) => {
    // get user ip address
    const ip =  req.ips.length > 0 ? req.ips[0] : req.ip;
    // get user agent
    const userAgent = new UserAgent(req.headers['user-agent']||'').getWithDevice() ;
    apiResponse.success(res, { ip: ip, userAgent: userAgent }, 'Welcome to Track My Show API Server 👌');
});
app.use('/api/v1', router);
app.use((req: Request, res: Response) => {
    apiResponse.notFound(res, [], 'URL Not Found');
});






app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});