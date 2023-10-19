import UAParser from "ua-parser-js";
import {Request} from 'express';

export default class UserAgent {
    public get(req: Request): Promise<string> {
        return new Promise((resolve, reject) => {

            const parser: UAParser.UAParserInstance = new UAParser();
            try{
                const userAgent: any = req.headers['user-agent'] || null;
                const result = parser.setUA(userAgent).getResult();
                if (result.browser.name && result.os.name) {
                    resolve(result.browser.name + ' ' + result.browser.version + ' on ' + result.os.name + ' ' + result.os.version);
                }

                if (result.browser.name) {
                    resolve('browser');
                }

                resolve(result.ua);
            }catch (err){
             resolve('Unknown');
            }





        });
    }


}

