import mysql from 'mysql';
import configDotenv from "dotenv";

export default class Connection {
    private static connection: any;
    private static databaseConfig()  {
        configDotenv.config();
        return {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        }
    }
    public static async getConnection() {
        if (this.connection) {
            return this.connection;
        }
        this.connection = mysql.createConnection(this.databaseConfig());
        return this.connection;
    }

    public static async closeConnection() {
        if (this.connection) {
            this.connection.end();
        }
    }

}