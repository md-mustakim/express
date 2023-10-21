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
    static ipValidator(ip) {
        // Regex expression for validating IPv4
        let ipv4 = /(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])/;
        // Regex expression for validating IPv6
        let ipv6 = /((([0-9a-fA-F]){1,4})\:){7}([0-9a-fA-F]){1,4}/;
        // Checking if it is a valid IPv4 addresses
        if (ip.match(ipv4))
            return true;
        // Checking if it is a valid IPv6 addresses
        else if (ip.match(ipv6))
            return true;
        // Return Invalid
        return false;
    }
}
exports.default = HelperFunction;
