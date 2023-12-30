import  { Request, Response, NextFunction } from 'express';
import apiResponse from "../Helper/apiResponse";
import jwt from "jsonwebtoken";
import Model from "../Helper/Model";
import HelperFunction from "../Helper/HelperFunction";
export const VerifyToken = (req: Request, res: Response, next: NextFunction) => {

    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        let secret: any = HelperFunction.env('TOKEN_SECRET');
        jwt.verify(token, secret, (err: any, decoded: any) => {
            if (err) {
                return apiResponse.unauthorized(res, 'Invalid Token', []);
            } else {

                let query = "SELECT * FROM users WHERE id = ?";
                let params = [decoded.id];

                Model.first(query, params).then((result: any) => {
                    if (result) {
                        req.body.user = result;



                        return next();
                    } else {
                        return apiResponse.unauthorized(res, 'Invalid Token', []);
                    }
                }).catch((err: any) => {
                    return apiResponse.unauthorized(res, 'Invalid Token', [err]);
                });
            }
        });
    } else {
        return apiResponse.unauthorized(res, 'Token Required', []);
    }
}