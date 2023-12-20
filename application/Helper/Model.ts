import Connection from "../Database/Connection";
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import HelperFunction from "./HelperFunction";


const Model =  {

    async queryExecute(query: string, params: any = []) {

        const connection = await Connection.getConnection();
        try {
            
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
        } finally {
            if(Connection){
                connection.release();                
            }

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
    },
    passwordHash(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
    },
    createJWTToken(payload: any) {
        let token:any = process.env.TOKEN_SECRET;
        console.log(token);
        return jwt.sign(payload, token, { expiresIn: '1h' });
    },
    verifyJWTToken(token: string) {

        try{

            let secret: any = HelperFunction.env('TOKEN_SECRET');
            jwt.verify(token, secret, (err: any, decoded: any) => {
                console.log(err, decoded);


            });
            return true;
        }catch(err){
            console.log(err);
            return false;
        }


    }
}

export default Model;