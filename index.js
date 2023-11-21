"use strict";
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
const express_1 = __importDefault(require("express"));
const apiResponse_1 = __importDefault(require("./application/Helper/apiResponse"));
const UserAgent_1 = __importDefault(require("./application/Helper/UserAgent"));
const guestRouter_1 = __importDefault(require("./application/Router/api/v1/guestRouter"));
const authenticatedRouter_1 = __importDefault(require("./application/Router/api/v1/authenticatedRouter"));
const HelperFunction_1 = __importDefault(require("./application/Helper/HelperFunction"));
const app = (0, express_1.default)();
const port = 4000;
app.use(express_1.default.json());
app.use('/public', express_1.default.static('public'));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ua = yield new UserAgent_1.default().get(req);
    apiResponse_1.default.success(res, 'Welcome to Track My Show API Server 👌', { ip: HelperFunction_1.default.ipv4AndIpv6(req.ip), device: ua });
}));
app.use('/api/v1/auth', guestRouter_1.default);
app.use('/api/v1', authenticatedRouter_1.default);
app.use((req, res) => {
    console.info(req);
    apiResponse_1.default.notFound(res, 'URL Not Found', []);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
