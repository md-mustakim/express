import {  Request } from 'express';
import configDotenv from "dotenv";
export default class HelperFunction{
    public static validationErrorFormat({msg, path}: any)  {
        return {
            field: path,
            message: msg
        }
    }
    public static getDateTime(seconds: number) {
        let date = new Date();
        date.setSeconds(date.getSeconds() + seconds);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    public static env(key: string) {
        configDotenv.config();
        return process.env[key];
    }

    public static getIpAddress(req: Request):string {
        return req.ips.length > 0 ? req.ips[0] : req.ip;
    }

    public static ipValidator(ip: string): boolean {
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


    public  static ipv4AndIpv6  (ip: string)  {
        let ipv4Address:any = '';
        let ipv6Address: string | undefined = '';
        if(ip.includes(':')) {
            if(ip.includes('.')) {
                const lastIndex = ip.lastIndexOf(':');
                ipv6Address = ip.slice(0, lastIndex + 1);
            }else {
                ipv6Address = ip;
            }
        }
        if(ip.includes('.')) {
            ipv4Address = ip.split(':').pop();
        }
        return {ipv4Address: ipv4Address, ipv6Address: ipv6Address};
    }


}

