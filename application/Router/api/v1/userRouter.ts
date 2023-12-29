import express, {  Request, Response, Router } from 'express';
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

        result = result.map((user: any) => {
            delete user.password;
            return user;
        });

        apiResponse.success(res, 'All Users', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});

userRouter.get('/:id', (req, res) => {

    Model.first('select * from users where id = ?', [req.params.id]).then((result: any) => {
        delete result.password;
        apiResponse.success(res, 'User Single', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});


userRouter.post('/update/:id', multer().none(),
  (_req: Request, res: Response) => {
    let checkIdParams = [_req.params.id];

     Model.get('SELECT * FROM users WHERE id = ?', checkIdParams).then((result: any) => {
        if (result.length == 0) {
            return apiResponse.notFound(res, 'User not found', []);
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

        let checkIdQuery = "SELECT * FROM users WHERE id = ?";
        let checkIdParams = [_req.params.id];

         Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, 'User not found', []);
            } else {
                let oldStatus = result.status;
                let newStatus: number = oldStatus == 1 ? 0 : 1;
                let query = "UPDATE users SET status = ?, updated_at = ? WHERE id = ?";
                let params = [newStatus, HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(query, params).then((result: any) => {

                    if (result.affectedRows > 0) {
                        let updatedQuery = "SELECT * FROM users WHERE id = ?";
                        let updatedParams = [_req.params.id];
                        Model.first(updatedQuery, updatedParams).then((result: any) => {
                            return apiResponse.success(res, 'Status Updated Successfully', result);
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