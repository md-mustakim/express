import express, { Express, Request, Response } from 'express';

import apiResponse from "./application/Helper/apiResponse";
import UserAgent from "./application/Helper/UserAgent";
import guestRouter from "./application/Router/api/v1/guestRouter";

import authenticateRouter from "./application/Router/api/v1/authenticatedRouter";


import HelperFunction from "./application/Helper/HelperFunction";

import cors from "cors";
import organizerRouter from './application/Router/api/v1/organizerRouter';

const app: Express = express();
const port = 4000;

// for cross-origin

app.use(cors());

app.use(express.json());

app.use('/public', express.static('public'));
app.get('/', async (req: Request, res: Response) => {
    const ua = await new UserAgent().get(req);
    apiResponse.success(res, 'Welcome to Track My Show API Server 👌', {ip: HelperFunction.ipv4AndIpv6(req.ip), device: ua});
});

app.use('/api/v1/auth', guestRouter);

app.use('/api/v1', authenticateRouter);
app.use('/api/v1/organizer', organizerRouter);



app.use((req: Request, res: Response) => {    
    apiResponse.notFound(res,  'URL Not Found', []);
});


app.listen(port,  () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});