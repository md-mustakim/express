import Connection from "../Database/Connection";
import * as bcrypt from 'bcryptjs';
const Model =  {

    async queryExecute(query: string, params: any = []) {
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
     async get(query: string, params: any = []) {
        return await this.queryExecute(query, params);
    },
     async first(query: string, params: any = []) {
    return  await this.queryExecute(query + ' limit 1', params);

    },
    passwordVerify(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);

    }
}

export default Model;