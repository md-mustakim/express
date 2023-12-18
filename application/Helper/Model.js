"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = __importDefault(require("../Database/Connection"));
const bcrypt = __importStar(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HelperFunction_1 = __importDefault(require("./HelperFunction"));
const Model = {
    queryExecute(query, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield Connection_1.default.getConnection();
                return yield new Promise((resolve, reject) => {
                    connection.query(query, params, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
            }
            catch (err) {
                return Promise.reject(err);
            }
            finally {
                if (Connection_1.default) {
                    yield Connection_1.default.closeConnection();
                }
            }
        });
    },
    get(query, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queryExecute(query, params);
        });
    },
    first(query, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queryExecute(query + ' limit 1', params);
        });
    },
    passwordVerify(password, hash) {
        return bcrypt.compareSync(password, hash);
    },
    passwordHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
    },
    createJWTToken(payload) {
        let token = process.env.TOKEN_SECRET;
        console.log(token);
        return jsonwebtoken_1.default.sign(payload, token, { expiresIn: '1h' });
    },
    verifyJWTToken(token) {
        try {
            let secret = HelperFunction_1.default.env('TOKEN_SECRET');
            jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
                console.log(err, decoded);
            });
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
};
exports.default = Model;
