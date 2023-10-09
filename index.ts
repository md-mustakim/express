import express, { Express, Request, Response } from 'express';
import { json, raw, text, urlencoded } from "body-parser";

import apiResponse from "./application/Helper/apiResponse";


import UserAgent from "./application/Helper/UserAgent";
import router from "./application/Router/api/v1/api";
import {query} from "express-validator";

const urlencodedParser = urlencoded({ extended: false });

const app: Express = express();
const port = 4000;

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(json());
// app.use(raw());
// app.use(text());
// app.use(urlencoded());

app.post('/test'
,(req: Request, res: Response) => {

    let body = req.body;

    


});


app.get('/', (req: Request, res: Response) => {

    // get user ip address
    const ip =  req.ips.length > 0 ? req.ips[0] : req.ip;
    // get user agent
    const userAgent = new UserAgent(req.headers['user-agent']||'').getWithDevice() ;
    apiResponse.success(res, 'Welcome to Track My Show API Server 👌', { ip: ip, userAgent: userAgent });

});
app.use('/api/v1', router);
app.use((req: Request, res: Response) => {
    apiResponse.notFound(res,  'URL Not Found', []);
});



app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});