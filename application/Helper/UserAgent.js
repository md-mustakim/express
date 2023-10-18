"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
class UserAgent {
    constructor(userAgent) {
        this.device = '';
        const parser = new ua_parser_js_1.default();
        const result = parser.setUA(userAgent).getResult();
        const browser = result.browser.name || '';
        const browserVersion = result.browser.version || '';
        this.browser = browser.trim() + ' ' + browserVersion.trim();
        const os = result.os.name || '';
        const osVersion = result.os.version || '';
        this.os = os.trim() + ' ' + osVersion.trim();
        if (result.device) {
            const deviceType = result.device.type || '';
            const deviceModel = result.device.model || '';
            this.device = deviceType.trim() + ' ' + deviceModel.trim();
        }
    }
    get() {
        return this.browser + ' on ' + this.os;
    }
    getWithDevice() {
        if (this.device.length > 1) {
            return this.browser + ' on ' + this.os + ' using ' + this.device;
        }
        return this.browser + ' on ' + this.os;
    }
}
exports.default = UserAgent;
