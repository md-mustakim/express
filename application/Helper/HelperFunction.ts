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
}

