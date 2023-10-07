import Connection from "../Database/Connection";

const Query = {
    get: async (query: string, params: any = []) => {
        try {
            const connection = await Connection.getConnection();
            return await new Promise((resolve, reject) => {
                connection.query(query, params, (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        } catch (err) {
            return Promise.reject(err);
        }
    },


}

export default Query;