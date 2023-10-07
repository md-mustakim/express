import express, { Express, Request, Response, Router } from 'express';
const app: Express = express();

const router: Router = Router();

router.use('/', (req: Request, res: Response) => {
    res.json({message: 'auth'});
});




export default router;