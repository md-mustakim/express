import {  Request, Response } from 'express';
import {body, validationResult} from "express-validator";
import HelperFunction from "../../../Helper/HelperFunction";
import apiResponse from "../../../Helper/apiResponse";
import Model from "../../../Helper/Model";
import {guestRouter} from "./router";


guestRouter.post('/register',[
    body('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long.'),
    body('phone')
        .custom(async (value: string) => {
            if(value.length !== 11) {
                throw new Error('Phone number must be 11 digits.');
            }

            let query = "SELECT * FROM users WHERE phone = ?";
            let params = [value];
            return Model.first(query, params).then((result: any) => {
                if (result.length > 0) {
                    throw new Error('Phone number already in use');
                }
            }).catch((err: any) => {
               throw new Error(err.message);
            });
        }),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')

], (req: Request, res: Response) => {

    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }

    let body = req.body;
    let {name, phone, password} = body;
        password = Model.passwordHash(password);
    let query = "INSERT INTO users (name, phone, password) VALUES (?, ?, ?)";
    let params = [name, phone, password];
    Model.queryExecute(query, params).then((result: any) => {
        console.log(result);
        return apiResponse.success(res, 'Registration is Successful', []);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });
});

guestRouter.post('/login',[
    body('phone').isLength({ min: 11, max:11 }).withMessage('Phone number must be 11 digits.'),
], (req: Request, res: Response) => {

    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }

    let {phone, password} = req.body;
    let query = "SELECT * FROM users WHERE phone = ?";
    let params = [phone];
    Model.first(query, params).then((result: any) => {
        if (result.length > 0) {
            let passwordVerify = Model.passwordVerify(password, result[0].password);
            if (passwordVerify) {
                let accessToken = Model.createJWTToken({id: result[0].id});

                // store token in database for future use
                let query = "INSERT INTO access_tokens (name, token, expired_at, user_id, ip, u_a) VALUES (?, ?, ?, ?, ?, ?)";
                let params = ['access_token', accessToken, HelperFunction.getDateTime(3600), result[0].id, req.ip, req.headers['user-agent']];

                Model.queryExecute(query, params).then(r => {
                    console.log(r);
                });

                let user = result[0];
                // remove password from user object
                delete user.password;

                return apiResponse.success(res, 'Login is Successful', {
                    accessToken: {
                        token: accessToken,
                        expiresInSec: 3600
                    },
                    user: result[0]
                });
            } else {
                return apiResponse.unauthorized(res, 'Password is incorrect', []);
            }
        } else {
            return apiResponse.unauthorized(res, 'Phone number is incorrect', []);
        }
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });
});


export default guestRouter;