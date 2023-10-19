"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
class HelperFunction {
    static validationErrorFormat({ msg, path }) {
        return {
            field: path,
            message: msg
        };
    }
    static getDateTime(seconds) {
        let date = new Date();
        date.setSeconds(date.getSeconds() + seconds);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
    static env(key) {
        dotenv_1.default.config();
        return process.env[key];
    }
    static getIpAddress(req) {
        return req.ips.length > 0 ? req.ips[0] : req.ip;
    }
}
exports.default = HelperFunction;
