"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = __importDefault(require("../Database/Connection"));
const UserController = {
    index: (req, res) => {
        Connection_1.default.getConnection().then((connection) => {
            connection.query('SELECT * FROM users', (err, rows) => {
                if (err) {
                    console.log(err);
                }
                console.log(rows);
                res.setHeader('Content-Type', 'application/json');
                res.json(rows);
            });
        });
        // res.send('Login');
    }
};
exports.default = UserController;
