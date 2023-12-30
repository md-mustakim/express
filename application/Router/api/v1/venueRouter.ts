import express, {  Request, Response, Router } from 'express';
import multer from "multer";
import apiResponse from "../../../Helper/apiResponse";
import HelperFunction from "../../../Helper/HelperFunction";
import Model from "../../../Helper/Model";

import { VerifyToken } from '../../../Middleware/VerifyToken';
import {body, validationResult} from "express-validator";


const modelName:string = 'Venue';
const tableName:string = 'venues';



const seatLayoutRouter: Router = Router();

seatLayoutRouter.use(VerifyToken);
seatLayoutRouter.use(express.urlencoded({ extended: true }));
seatLayoutRouter.use(express.json());

seatLayoutRouter.get('/', (_req: Request, res: Response) => {
    let query: string;
    if(_req.query.trash == 'yes'){
         query = "select * from " + tableName +  " where deleted_at is not null";
    }else {
       query = "select * from " + tableName +  " where deleted_at is null";
    }

    Model.get(query).then((result: any) => {
        apiResponse.success(res, 'All ' + modelName, result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});

seatLayoutRouter.post('/', multer().none(), [
    body('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long.'),

], (req: Request, res: Response) => {

    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }else
    {
        let {name, address, latitude, longitude, google_map_url} = req.body;
        const query = 'INSERT INTO `' + tableName + ' `(`name`, `address`, `latitude`, `longitude`, `google_map_url`, `created_u_a`, `created_ip`, `created_by`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?,?,?,?,?)';
        const params = [name, address, latitude, longitude, google_map_url, req.headers['user-agent'], req.ip, 1, HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];

        Model.queryExecute(query, params).then((result: any) => {
            if (result.affectedRows > 0) {
                let updatedQuery = "SELECT * FROM " + tableName + " WHERE id = ?";
                let updatedParams = [result.insertId];
                Model.first(updatedQuery, updatedParams).then((result: any) => {
                    return apiResponse.success(res, modelName + ' Created Successfully', result);
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
});


seatLayoutRouter.get('/:id', (req, res) => {
    Model.first("select * from " + tableName +  " where id = ?", [req.params.id]).then((result: any) => {
        delete result.password;
        apiResponse.success(res, modelName + ' Single', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});


seatLayoutRouter.post('/update/:id', multer().none(),
  (_req: Request, res: Response) => {
    let checkIdParams = [_req.params.id];
     Model.get("SELECT * FROM " + tableName +  " WHERE id = ?", checkIdParams).then((result: any) => {
        if (result.length == 0) {
            return apiResponse.notFound(res, modelName + ' not found', []);
        } else {
            let {name, address, latitude, longitude, google_map_url} = _req.body;
            let query:string = "UPDATE " + tableName  + " SET name = ?, address = ?, latitude = ?, longitude = ?, google_map_url = ?, updated_at = ? WHERE id = ?";
            console.log(query);
            let params = [name, address, latitude, longitude, google_map_url, HelperFunction.getDateTime(0), _req.params.id];

            Model.queryExecute(query, params).then((result: any) => {
                if (result.affectedRows > 0) {
                    let updatedQuery = "SELECT * FROM " + tableName +  " WHERE id = ?";
                    let updatedParams = [_req.params.id];
                    Model.first(updatedQuery, updatedParams).then((result: any) => {
                        delete result.password;
                        return apiResponse.success(res, modelName + ' Updated Successfully', result);
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


seatLayoutRouter.post('/change-status/:id', multer().none(),
    (_req: Request, res: Response) => {

        let checkIdQuery = "SELECT * FROM " + tableName +  " WHERE id = ?";
        let checkIdParams = [_req.params.id];

         Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, modelName + ' not found', []);
            } else {
                let oldStatus = result.status;
                let newStatus: number = oldStatus == 1 ? 0 : 1;
                let query = "UPDATE layouts SET status = ?, updated_at = ? WHERE id = ?";
                let params = [newStatus, HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(query, params).then((result: any) => {
                    if (result.affectedRows > 0) {
                        let updatedQuery = "SELECT * FROM " + tableName +  " WHERE id = ?";
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

seatLayoutRouter.post('/delete/:id', multer().none(),
    (_req: Request, res: Response) => {

        let checkIdQuery = "SELECT * FROM " + tableName +  " WHERE  deleted_at is null and id = ?";
        let checkIdParams = [_req.params.id];

        Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, modelName + ' not found', []);
            } else {
                   let deletedReason = 'Deleted by Admin';
                let deleteQuery = "UPDATE " + tableName +  " SET deleted_at = ?, deleted_reason =?, updated_at = ? WHERE id = ?";
                let params = [ HelperFunction.getDateTime(0), deletedReason,HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(deleteQuery, params).then((result: any) => {
                    if (result.affectedRows > 0) {
                        return apiResponse.success(res, modelName + ' Deleted Successfully', []);
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



seatLayoutRouter.post('/restore/:id', multer().none(),
    (_req: Request, res: Response) => {

        let checkIdQuery = "SELECT * FROM " + tableName +  " WHERE deleted_at is not null and id = ?";
        let checkIdParams = [_req.params.id];

        Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, modelName + ' not found', []);
            } else {
                let deleteQuery = "UPDATE " + tableName +  " SET deleted_at = ?, deleted_reason = ?, updated_at = ? WHERE id = ?";
                let params = [ null, null,HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(deleteQuery, params).then((result: any) => {
                    if (result.affectedRows > 0) {
                        return apiResponse.success(res, modelName + ' Restore Successfully', []);
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


export default seatLayoutRouter;