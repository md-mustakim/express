"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
class UserAgent {
    get(req) {
        return new Promise((resolve, reject) => {
            const parser = new ua_parser_js_1.default();
            try {
                const userAgent = req.headers['user-agent'] || null;
                const result = parser.setUA(userAgent).getResult();
                console.log(result.device);
                if (result.browser.name && result.os.name) {
                    if (result.device.vendor && result.device.model) {
                        resolve(result.browser.name + ' ' + result.browser.version + ' on ' + result.os.name + ' ' + result.os.version + ' of ' + result.device.vendor + ' ' + result.device.model);
                    }
                    resolve(result.browser.name + ' ' + result.browser.version + ' on ' + result.os.name + ' ' + result.os.version);
                }
                if (result.browser.name) {
                    resolve('browser');
                }
                resolve(result.ua);
            }
            catch (err) {
                resolve('Unknown');
            }
        });
    }
}
exports.default = UserAgent;
