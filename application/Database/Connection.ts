import mysql from 'mysql';
import configDotenv from "dotenv";

export default class Connection {

    private static connection: any = null;

    private static databaseConfig()  {
        configDotenv.config();

        return {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }
    }


    public static async getConnection() {
        if (this.connection == null) {
            console.log('Creating NEW Database Connection .................... ');
            this.connection = mysql.createPool(this.databaseConfig());
        }
        console.log('Establishing OLD Database Connection .................... ');
        return this.connection;
    }

}