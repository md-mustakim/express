import express, {  Request, Response, Router } from 'express';
import {body, validationResult} from "express-validator";
import multer from "multer";
import apiResponse from "../../../Helper/apiResponse";
import HelperFunction from "../../../Helper/HelperFunction";
import Model from "../../../Helper/Model";

import { VerifyToken } from '../../../Middleware/VerifyToken';


const organizerRouter: Router = Router();

organizerRouter.use(VerifyToken);
organizerRouter.use(express.urlencoded({ extended: true }));
organizerRouter.use(express.json());

organizerRouter.get('/', (req, res) => {
    
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

organizerRouter.get('/:id', (req, res) => {

    const params = [req.params.id];
    const allUserQuery = 'select * from organizers where id = ?';
    Model.first(allUserQuery, params).then((result: any) => {

        result.cover = HelperFunction.env('APP_URL') + '/public/organizer/' + result.cover;

        apiResponse.success(res, 'Organizer', result);
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

organizerRouter.use(express.static('public'));
organizerRouter.use(express.static('event'));

organizerRouter.post('/',
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
    


    let query = "INSERT INTO organizers (name, slug, description, cover, about, created_u_a, created_ip, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let params = [name, slug, description, cover, about, req.headers['user-agent'], HelperFunction.getIpAddress(req), HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];
    Model.queryExecute(query, params).then((result: any) => {
        console.log(result);

            
            return apiResponse.success(res, 'Registration is Successful', []);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);

    });
    }

);




organizerRouter.post('/update/:id', multer().none(),
  (_req: Request, res: Response) => {



    let checkIdQuery = "SELECT * FROM organizers WHERE id = ?";
    let checkIdParams = [_req.params.id];

     Model.get(checkIdQuery, checkIdParams).then((result: any) => {
        if (result.length == 0) {
            return apiResponse.notFound(res, 'Organizer not found', []);
        } else {

            let {name, description, about} = _req.body;

            let query = "UPDATE organizers SET name = ?, description = ?, about = ?, updated_at = ? WHERE id = ?";
            let params = [name, description, about,  HelperFunction.getDateTime(0), _req.params.id];
            Model.queryExecute(query, params).then((result: any) => {

                if (result.affectedRows > 0) {


                    let updatedQuery = "SELECT * FROM organizers WHERE id = ?";
                    let updatedParams = [_req.params.id];
                    Model.first(updatedQuery, updatedParams).then((result: any) => {
                        result.cover = HelperFunction.env('APP_URL') + '/public/organizer/' + result.cover;
                        return apiResponse.success(res, 'Updated Successfully', result);
                    }).catch((err: any) => {
                        return apiResponse.error(res, err.message, []);
                    });



                } else {
                    return apiResponse.error(res, 'Error', []);
                }



            }).catch((err: any) => {
                return apiResponse.error(res, err.message, []);

            });

        }
     }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
     });


    }
);

export default organizerRouter;