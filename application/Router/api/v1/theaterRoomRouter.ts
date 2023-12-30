import express, {  Request, Response, Router } from 'express';
import multer from "multer";
import apiResponse from "../../../Helper/apiResponse";
import HelperFunction from "../../../Helper/HelperFunction";
import Model from "../../../Helper/Model";

import { VerifyToken } from '../../../Middleware/VerifyToken';
import {body, validationResult} from "express-validator";


const theaterRoomRouter: Router = Router();

theaterRoomRouter.use(VerifyToken);
theaterRoomRouter.use(express.urlencoded({ extended: true }));
theaterRoomRouter.use(express.json());

theaterRoomRouter.get('/', (_req, res) => {

    let query: string = "select * from theater_rooms where deleted_at is null";

    Model.get(query).then((result: any) => {
        apiResponse.success(res, 'All Theater Rooms', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});

theaterRoomRouter.post('/', multer().none(), [
    body('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long.'),
    body('venue_id')
        .custom(async (value: string) => {
            let query = "SELECT * FROM venues WHERE id = ?";
            let params = [value];
            return Model.first(query, params).then((result: any) => {
                if (result.length == 0) {
                    throw new Error('Venue not found');
                }
            }).catch((err: any) => {
                throw new Error(err.message);
            });
        }),
    body('seat_capacity')
        .isLength({ min: 1 })
        .withMessage('Seat Capacity must be at least 1 characters long.'),
    body('layout_id')
        .custom(async (value: string) => {
            let query = "SELECT * FROM layouts WHERE id = ?";
            let params = [value];
            return Model.first(query, params).then((result: any) => {
                if (result.length == 0) {
                    throw new Error('Layout not found');
                }
            }).catch((err: any) => {
                throw new Error(err.message);
            });
        }),
    body('created_by')
        .custom(async (value: string) => {
            let query = "SELECT * FROM theater_rooms WHERE id = ?";
            let params = [value];
            return Model.first(query, params).then((result: any) => {
                if (result.length == 0) {
                    throw new Error('Theater Room not found');
                }
            }).catch((err: any) => {
                throw new Error(err.message);
            });
        }),

], (req: Request, res: Response) => {


    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }else
    {
        let {name, venue_id, seat_capacity, layout_id, created_by} = req.body;
        let query = "INSERT INTO theater_rooms (name, venue_id, seat_capacity, layout_id, created_by, created_ip, created_u_a, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        let params = [name, venue_id, seat_capacity, layout_id, created_by, HelperFunction.ipv4AndIpv6(req.ip).ipv4Address, req.headers['user-agent'], HelperFunction.getDateTime(0)];
        Model.queryExecute(query, params).then((result: any) => {
            if (result.affectedRows > 0) {
                let updatedQuery = "SELECT * FROM theater_rooms WHERE id = ?";
                let updatedParams = [result.insertId];
                Model.first(updatedQuery, updatedParams).then((result: any) => {
                    return apiResponse.success(res, 'Theater Room Created Successfully', result);
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


theaterRoomRouter.get('/:id', (req, res) => {

    Model.first('select * from theater_rooms where id = ?', [req.params.id]).then((result: any) => {
        delete result.password;
        apiResponse.success(res, 'Theater Room Single', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});


theaterRoomRouter.post('/update/:id', multer().none(),
  (_req: Request, res: Response) => {
    let checkIdParams = [_req.params.id];

     Model.get('SELECT * FROM theater_rooms WHERE id = ?', checkIdParams).then((result: any) => {
        if (result.length == 0) {
            return apiResponse.notFound(res, 'Theater Room not found', []);
        } else {


            let {name, venue_id, seat_capacity, layout_id, created_by} = _req.body;
            let query = "UPDATE theater_rooms SET name = ?, venue_id = ?, seat_capacity = ?, layout_id = ?, created_by = ?, updated_at = ? WHERE id = ?";
            let params = [name, venue_id, seat_capacity, layout_id, created_by, HelperFunction.getDateTime(0), _req.params.id];

            Model.queryExecute(query, params).then((result: any) => {
                if (result.affectedRows > 0) {
                    let updatedQuery = "SELECT * FROM theater_rooms WHERE id = ?";
                    let updatedParams = [_req.params.id];
                    Model.first(updatedQuery, updatedParams).then((result: any) => {
                        delete result.password;
                        return apiResponse.success(res, 'Theater Room Updated Successfully', result);
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


theaterRoomRouter.post('/change-status/:id', multer().none(),
    (_req: Request, res: Response) => {

        let checkIdQuery = "SELECT * FROM theater_rooms WHERE id = ?";
        let checkIdParams = [_req.params.id];

         Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, 'Theater Room not found', []);
            } else {
                let oldStatus = result.status;
                let newStatus: number = oldStatus == 1 ? 0 : 1;
                let query = "UPDATE theater_rooms SET status = ?, updated_at = ? WHERE id = ?";
                let params = [newStatus, HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(query, params).then((result: any) => {

                    if (result.affectedRows > 0) {
                        let updatedQuery = "SELECT * FROM theater_rooms WHERE id = ?";
                        let updatedParams = [_req.params.id];
                        Model.first(updatedQuery, updatedParams).then((result: any) => {
                            delete result.password;
                            return apiResponse.success(res, 'Theater Room Updated Successfully', result);
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

theaterRoomRouter.post('/delete/:id', multer().none(),
    (_req: Request, res: Response) => {

        let checkIdQuery = "SELECT * FROM theater_rooms WHERE  deleted_at is null and id = ?";
        let checkIdParams = [_req.params.id];

        Model.first(checkIdQuery, checkIdParams).then((result: any) => {
            if (result === null) {
                return apiResponse.notFound(res, 'Theater Room not found', []);
            } else {
                   let deletedReason = 'Deleted by Admin';
                let deleteQuery = "UPDATE theater_rooms SET deleted_at = ?, delete_reason =?, updated_at = ? WHERE id = ?";
                let params = [ HelperFunction.getDateTime(0), deletedReason,HelperFunction.getDateTime(0), _req.params.id];
                Model.queryExecute(deleteQuery, params).then((result: any) => {
                    if (result.affectedRows > 0) {
                        return apiResponse.success(res, 'Theater Room Deleted Successfully', []);
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



export default theaterRoomRouter;