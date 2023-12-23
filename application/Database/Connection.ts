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
        
        
        // check connection is already created
        if(this.connection && this.connection.state === 'connected'){            
            return this.connection;
        }else{            
            let connection =  mysql.createConnection(this.databaseConfig());
            this.connection = connection;            
            return this.connection;
        }
    }

    public static async closeConnection() {
        if (this.connection && this.connection.state === 'connected') {            
            await this.connection.end();
        }
    }



}