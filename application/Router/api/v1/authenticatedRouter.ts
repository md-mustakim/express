import express, {Router} from "express";
import {VerifyToken} from "../../../Middleware/VerifyToken";

const authenticateRouter: Router = Router();

authenticateRouter.use(express.urlencoded({ extended: true }));
authenticateRouter.use(express.json());

authenticateRouter.use(VerifyToken);

authenticateRouter.get('/test', (req, res) => {
    res.send('hello');
});




export default authenticateRouter;