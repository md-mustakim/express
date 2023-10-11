import express, {  Request, Response, Router } from 'express';
import {VerifyToken} from "../../../Middleware/VerifyToken";
import {body, validationResult} from "express-validator";
import multer from "multer";
import apiResponse from "../../../Helper/apiResponse";
import HelperFunction from "../../../Helper/HelperFunction";


const authenticateRouter: Router = Router();

authenticateRouter.use(express.urlencoded({ extended: true }));
authenticateRouter.use(express.json());

authenticateRouter.use(VerifyToken);

authenticateRouter.get('/organizer', (req, res) => {
    res.send('get all organizer');
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/organizer');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
authenticateRouter.use(express.static('public'));

authenticateRouter.post('/organizer', upload.single('cover') ,[
    body('name').notEmpty().withMessage('Name is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
    body('description').notEmpty().withMessage('Description is required'),

], (req: Request, res: Response) => {

    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }



    res.send('create organizer');
});




export default authenticateRouter;