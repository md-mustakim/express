import express, {  Request, Response,NextFunction, Router } from 'express';
import {VerifyToken} from "../../../Middleware/VerifyToken";
import {body, query, validationResult} from "express-validator";
import multer from "multer";
import apiResponse from "../../../Helper/apiResponse";
import HelperFunction from "../../../Helper/HelperFunction";
import Model from "../../../Helper/Model";


const authenticateRouter: Router = Router();
authenticateRouter.use(VerifyToken);
authenticateRouter.use(express.urlencoded({ extended: true }));
authenticateRouter.use(express.json());

authenticateRouter.get('/user', (req, res) => {
    const allUserQuery = 'select * from users';
    Model.get(allUserQuery).then((result: any) => {
        const users = result.map((user: any) => {
            user.password = undefined;
            return user;
        });
        apiResponse.success(res, 'All User', users);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});
authenticateRouter.get('/organizer', (req, res) => {
    const allUserQuery = 'select * from organizers';
    Model.get(allUserQuery).then((result: any) => {

        result = result.map((organizer: any) => {
            organizer.cover = HelperFunction.env('APP_URL') + '/public/organizer/' + organizer.cover;
            return organizer;
        });

        apiResponse.success(res, 'All Organizer', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
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

authenticateRouter.post('/organizer',
    upload.single('cover'), [
    body('name').notEmpty().withMessage('Name is required'),
    body('slug').custom(async (value: string) => {
        let query = "SELECT * FROM organizers WHERE slug = ?";
        let params = [value];
        return Model.first(query, params).then((result: any) => {
            if (result.length > 0) {
                throw new Error('Slug already in use');
            }
        }).catch((err: any) => {
            throw new Error(err.message);
        })}),
    body('description').notEmpty().withMessage('Description is required'),
], (req: Request, res: Response) => {
    if(!req.file){
        return apiResponse.validationErrorWithData(res, 'Validation Error', [{message: 'Cover is required'}]);
    }

    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }

    let body = req.body;
    let {name, slug, description, about} = body;
    let cover = req.file.filename;
    console.log(req.file);


    let query = "INSERT INTO organizers (name, slug, description, cover, about, created_u_a, created_ip, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let params = [name, slug, description, cover, about, req.headers['user-agent'], HelperFunction.getIpAddress(req), HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];
    let r = Model.queryExecute(query, params).then((result: any) => {

            console.log(result);
            return apiResponse.success(res, 'Registration is Successful', []);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);

    });
    }
);




export default authenticateRouter;