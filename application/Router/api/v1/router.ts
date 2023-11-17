import express, {Router} from "express";
import {VerifyToken} from "../../../Middleware/VerifyToken";

const authenticateRouter: Router = Router();
authenticateRouter.use(VerifyToken);
authenticateRouter.use(express.urlencoded({ extended: true }));
authenticateRouter.use(express.json());

export default authenticateRouter;