import express, {  Request, Response, Router } from 'express';
import {body, validationResult} from "express-validator";
import multer from "multer";
import apiResponse from "../../../Helper/apiResponse";
import HelperFunction from "../../../Helper/HelperFunction";
import Model from "../../../Helper/Model";

import { VerifyToken } from '../../../Middleware/VerifyToken';


const userRouter: Router = Router();

userRouter.use(VerifyToken);
userRouter.use(express.urlencoded({ extended: true }));
userRouter.use(express.json());

userRouter.get('/', (_req, res) => {
    Model.get('select * from users').then((result: any) => {
        apiResponse.success(res, 'All Users', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});

userRouter.get('/:id', (req, res) => {

    Model.first('select * from users where id = ?', [req.params.id]).then((result: any) => {
        apiResponse.success(res, 'User', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});

const storage = multer.diskStorage({
    destination: function (_req, file, cb) {
        
        cb(null, 'public/organizer');
    },
    filename: function (req, file, cb) {
        
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

userRouter.post('/update/:id', multer().none(),
  (_req: Request, res: Response) => {
    let checkIdParams = [_req.params.id];

     Model.get('SELECT * FROM users WHERE id = ?', checkIdParams).then((result: any) => {
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

userRouter.post('/status-update/:id', multer().none(),
    (_req: Request, res: Response) => {

        let checkIdQuery = "SELECT * FROM organizers WHERE id = ?";
        let checkIdParams = [_req.params.id];

         Model.get(checkIdQuery, checkIdParams).then((result: any) => {
            if (result.length == 0) {
                return apiResponse.notFound(res, 'Organizer not found', []);
            } else {

                let {status} = _req.body;

                let query = "UPDATE organizers SET status = ?, updated_at = ? WHERE id = ?";
                let params = [status, HelperFunction.getDateTime(0), _req.params.id];
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

export default userRouter;