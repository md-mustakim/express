import mysql from 'mysql';

export default class Connection {
    private static connection: any;

    private static databaseConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'breb'
    }

    public static async getConnection() {
        if (this.connection) {
            return this.connection;
        }
        this.connection = mysql.createConnection(this.databaseConfig);
        return this.connection;
    }
}