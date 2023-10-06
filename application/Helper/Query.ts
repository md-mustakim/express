import Connection from "../Database/Connection";

const Query = {
    get: async (query: string) => {
        Connection.getConnection().then((connection) => {
            connection.query(query, (err: any, rows: any) => {
                if (err) {
                   return Promise.reject(err);
                }
                console.log(rows);
                return Promise.resolve(rows);
            });
        });
    }
}

export default Query;