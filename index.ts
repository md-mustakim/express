import express, { Express, Request, Response } from 'express';
import apiResponse from "./application/Helper/apiResponse";


const app: Express = express();
const port = 4000;

app.get('/', (req: Request, res: Response) => {
    apiResponse.success(res, { name: 'John Doe' }, 'Success');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});