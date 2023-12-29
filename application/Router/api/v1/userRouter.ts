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

    // check trash-user
    let query: string;
    if(_req.query.trash == 'yes'){
         query = "select * from users where deleted_at is not null";
    }else {
         query = "select * from users where deleted_at is null";
    }

    Model.get(query).then((result: any) => {
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

            let {name, phone, email, user_type_id} = _req.body;

            let query = "UPDATE users SET name = ?, phone = ?, email = ?, user_type_id = ?, updated_at = ? WHERE id = ?";
            let params = [name, phone, email, user_type_id, HelperFunction.getDateTime(0), _req.params.id];

            Model.queryExecute(query, params).then((result: any) => {
                if (result.affectedRows > 0) {
                    let updatedQuery = "SELECT * FROM users WHERE id = ?";
                    let updatedParams = [_req.params.id];
                    Model.first(updatedQuery, updatedParams).then((result: any) => {
                        delete result.password;
                        return apiResponse.success(res, 'User Updated Successfully', result);
                    }).catch((err: any) => {
                        return apiResponse.error(res, err.message, []);
                    });

                } else {
                    return apiResponse.error(res, 'Error', []);
                }

            }).catch((err: any) => {
                return apiResponse.error(res, err.message, [_req.body]);
            });

        }
     }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
     });
    }
);


userRouter.post('/change-status/:id', multer().none(),
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
                            delete result.password;
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

userRouter.post('/delete/:id', multer().none(),
    (_req: Request, res: Response) => {

        let checkIdQuery = "SELECT * FROM users WHERE  deleted_at is null and id = ?";
        let checkIdParams = [_req.params.id];

        Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, 'User not found', []);
            } else {
                   let deletedReason = 'Deleted by Admin';
                let deleteQuery = "UPDATE users SET deleted_at = ?, delete_reason =?, updated_at = ? WHERE id = ?";
                let params = [ HelperFunction.getDateTime(0), deletedReason,HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(deleteQuery, params).then((result: any) => {
                    if (result.affectedRows > 0) {
                        return apiResponse.success(res, 'User Deleted Successfully', []);
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



userRouter.post('/restore/:id', multer().none(),
    (_req: Request, res: Response) => {

        let checkIdQuery = "SELECT * FROM users WHERE deleted_at is not null and id = ?";
        let checkIdParams = [_req.params.id];

        Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, 'User not found', []);
            } else {
                let deleteQuery = "UPDATE users SET deleted_at = ?, delete_reason = ?, updated_at = ? WHERE id = ?";
                let params = [ null, null,HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(deleteQuery, params).then((result: any) => {
                    if (result.affectedRows > 0) {
                        return apiResponse.success(res, 'User Restore Successfully', []);
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