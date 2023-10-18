"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiResponse_1 = __importDefault(require("../Helper/apiResponse"));
const AuthController = {
    login: (req, res) => {
        console.log('ok');
        return apiResponse_1.default.success(res, 'Login is Successful', []);
    },
    register: (req, res) => {
    },
    verifyPass(req, res) {
    }
};
exports.default = AuthController;
