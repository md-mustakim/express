"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const express_validator_1 = require("express-validator");
const HelperFunction_1 = __importDefault(require("../../../Helper/HelperFunction"));
const apiResponse_1 = __importDefault(require("../../../Helper/apiResponse"));
const Model_1 = __importDefault(require("../../../Helper/Model"));
const router = (0, express_1.Router)();
router.use(express_1.default.urlencoded({ extended: true }));
router.use(express_1.default.json());
router.post('/register', [
    (0, express_validator_1.body)('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long.'),
    (0, express_validator_1.body)('phone')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        if (value.length !== 11) {
            throw new Error('Phone number must be 11 digits.');
        }
        let query = "SELECT * FROM users WHERE phone = ?";
        let params = [value];
        return Model_1.default.first(query, params).then((result) => {
            if (result.length > 0) {
                throw new Error('Phone number already in use');
            }
        }).catch((err) => {
            throw new Error(err.message);
        });
    })),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(HelperFunction_1.default.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let body = req.body;
    let { name, phone, password } = body;
    password = Model_1.default.passwordHash(password);
    let query = "INSERT INTO users (name, phone, password) VALUES (?, ?, ?)";
    let params = [name, phone, password];
    let r = Model_1.default.queryExecute(query, params).then((result) => {
        console.log(result);
        return apiResponse_1.default.success(res, 'Registration is Successful', []);
    }).catch((err) => {
        return apiResponse_1.default.error(res, err.message, []);
    });
});
router.post('/login', [
    (0, express_validator_1.body)('phone').isLength({ min: 11, max: 11 }).withMessage('Phone number must be 11 digits.'),
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(HelperFunction_1.default.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let { phone, password } = req.body;
    let query = "SELECT * FROM users WHERE phone = ?";
    let params = [phone];
    Model_1.default.first(query, params).then((result) => {
        if (result.length > 0) {
            let passwordVerify = Model_1.default.passwordVerify(password, result[0].password);
            if (passwordVerify) {
                let accessToken = Model_1.default.createJWTToken({ id: result[0].id });
                // store token in database for future use
                let query = "INSERT INTO access_tokens (name, token, expired_at, user_id, ip, u_a) VALUES (?, ?, ?, ?, ?, ?)";
                let params = ['access_token', accessToken, HelperFunction_1.default.getDateTime(3600), result[0].id, req.ip, req.headers['user-agent']];
                Model_1.default.queryExecute(query, params).then(r => {
                    console.log(r);
                });
                let user = result[0];
                // remove password from user object
                delete user.password;
                return apiResponse_1.default.success(res, 'Login is Successful', {
                    accessToken: {
                        token: accessToken,
                        expiresInSec: 3600
                    },
                    user: result[0]
                });
            }
            else {
                return apiResponse_1.default.unauthorized(res, 'Password is incorrect', []);
            }
        }
        else {
            return apiResponse_1.default.unauthorized(res, 'Phone number is incorrect', []);
        }
    }).catch((err) => {
        return apiResponse_1.default.error(res, err.message, []);
    });
});
exports.default = router;
