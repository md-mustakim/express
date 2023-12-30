import express, {  Request, Response, Router } from 'express';
import multer from "multer";
import apiResponse from "../../../Helper/apiResponse";
import HelperFunction from "../../../Helper/HelperFunction";
import Model from "../../../Helper/Model";

import { VerifyToken } from '../../../Middleware/VerifyToken';
import {body, validationResult} from "express-validator";


const seatLayoutRouter: Router = Router();

seatLayoutRouter.use(VerifyToken);
seatLayoutRouter.use(express.urlencoded({ extended: true }));
seatLayoutRouter.use(express.json());

seatLayoutRouter.get('/', (_req, res) => {

    let query: string;
    if(_req.query.trash == 'yes'){
         query = "select * from layouts where deleted_at is not null";
    }else {
       query = "select * from layouts where deleted_at is null";
    }

    Model.get(query).then((result: any) => {
        apiResponse.success(res, 'All Seat Layouts', result);
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
        let {name, stage_count, seat_count, seat_layout_json} = req.body;
        let query = "INSERT INTO layouts (name, stage_count, seat_count, seat_layout_json) VALUES (?, ?, ?, ?)";
        let params = [name, stage_count, seat_count, seat_layout_json];

        Model.queryExecute(query, params).then((result: any) => {
            if (result.affectedRows > 0) {
                let updatedQuery = "SELECT * FROM layouts WHERE id = ?";
                let updatedParams = [result.insertId];
                Model.first(updatedQuery, updatedParams).then((result: any) => {
                    return apiResponse.success(res, 'Seat Layout Created Successfully', result);
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
    Model.first('select * from layouts where id = ?', [req.params.id]).then((result: any) => {
        delete result.password;
        apiResponse.success(res, 'Seat Layout Single', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});


seatLayoutRouter.post('/update/:id', multer().none(),
  (_req: Request, res: Response) => {
    let checkIdParams = [_req.params.id];
     Model.get('SELECT * FROM layouts WHERE id = ?', checkIdParams).then((result: any) => {
        if (result.length == 0) {
            return apiResponse.notFound(res, 'Seat Layout not found', []);
        } else {
            let {name, stage_count, seat_count, seat_layout_json} = _req.body;
            let query = "UPDATE layouts SET name = ?, stage_count = ?, seat_count = ?, seat_layout_json = ? WHERE id = ?";
            let params = [name, stage_count, seat_count, seat_layout_json, _req.params.id];
            Model.queryExecute(query, params).then((result: any) => {
                if (result.affectedRows > 0) {
                    let updatedQuery = "SELECT * FROM layouts WHERE id = ?";
                    let updatedParams = [_req.params.id];
                    Model.first(updatedQuery, updatedParams).then((result: any) => {
                        delete result.password;
                        return apiResponse.success(res, 'Seat Layout Updated Successfully', result);
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

        let checkIdQuery = "SELECT * FROM layouts WHERE id = ?";
        let checkIdParams = [_req.params.id];

         Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, 'Seat Layout not found', []);
            } else {
                let oldStatus = result.status;
                let newStatus: number = oldStatus == 1 ? 0 : 1;
                let query = "UPDATE layouts SET status = ?, updated_at = ? WHERE id = ?";
                let params = [newStatus, HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(query, params).then((result: any) => {
                    if (result.affectedRows > 0) {
                        let updatedQuery = "SELECT * FROM layouts WHERE id = ?";
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

        let checkIdQuery = "SELECT * FROM layouts WHERE  deleted_at is null and id = ?";
        let checkIdParams = [_req.params.id];

        Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, 'Seat Layout not found', []);
            } else {
                   let deletedReason = 'Deleted by Admin';
                let deleteQuery = "UPDATE layouts SET deleted_at = ?, deleted_reason =?, updated_at = ? WHERE id = ?";
                let params = [ HelperFunction.getDateTime(0), deletedReason,HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(deleteQuery, params).then((result: any) => {
                    if (result.affectedRows > 0) {
                        return apiResponse.success(res, 'Seat Layout Deleted Successfully', []);
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

        let checkIdQuery = "SELECT * FROM layouts WHERE deleted_at is not null and id = ?";
        let checkIdParams = [_req.params.id];

        Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, 'Seat Layout not found', []);
            } else {
                let deleteQuery = "UPDATE layouts SET deleted_at = ?, deleted_reason = ?, updated_at = ? WHERE id = ?";
                let params = [ null, null,HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(deleteQuery, params).then((result: any) => {
                    if (result.affectedRows > 0) {
                        return apiResponse.success(res, 'Seat Layout Restore Successfully', []);
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