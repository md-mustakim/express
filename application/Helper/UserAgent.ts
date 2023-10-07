import UAParser from "ua-parser-js";

export default class UserAgent {
    public browser: string;
    public os: string;
    public device: string = '';
    constructor(userAgent: string) {
        const parser = new UAParser();
        const result =   parser.setUA(userAgent).getResult();
        const browser = result.browser.name || '';
        const browserVersion = result.browser.version || '';

        this.browser = browser.trim() + ' ' + browserVersion.trim();
        const os = result.os.name || '';
        const osVersion = result.os.version || '';
        this.os = os.trim() + ' ' + osVersion.trim();
        if(result.device){
            const deviceType = result.device.type || '';
            const deviceModel = result.device.model || '';
            this.device = deviceType.trim() + ' ' + deviceModel.trim();
        }
    }

    public get() {
        return this.browser + ' on ' + this.os;
    }

    public getWithDevice() {
        if(this.device.length > 1){
            return this.browser + ' on ' + this.os + ' using ' + this.device;
        }
        return this.browser + ' on ' + this.os;
    }
}

