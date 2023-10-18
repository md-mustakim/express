"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = void 0;
const apiResponse_1 = __importDefault(require("../Helper/apiResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Model_1 = __importDefault(require("../Helper/Model"));
const HelperFunction_1 = __importDefault(require("../Helper/HelperFunction"));
const VerifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        let secret = HelperFunction_1.default.env('TOKEN_SECRET');
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                return apiResponse_1.default.unauthorized(res, 'Invalid Token', []);
            }
            else {
                let query = "SELECT * FROM users WHERE id = ?";
                let params = [decoded.id];
                Model_1.default.first(query, params).then((result) => {
                    if (result.length > 0) {
                        req.body.user = result[0];
                        return next();
                    }
                    else {
                        return apiResponse_1.default.unauthorized(res, 'Invalid Token', []);
                    }
                }).catch((err) => {
                    return apiResponse_1.default.unauthorized(res, 'Invalid Token', []);
                });
            }
        });
    }
    else {
        return apiResponse_1.default.unauthorized(res, 'Token Required', []);
    }
};
exports.VerifyToken = VerifyToken;
