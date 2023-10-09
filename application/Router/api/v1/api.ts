import express, { Express, Request, Response, Router } from 'express';
import AuthController from "../../../Controller/AuthController";
import {check} from "express-validator";
const app: Express = express();

const router: Router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.post('/test', (req: Request, res: Response) => {
    res.json(req.body);
});



export default router;