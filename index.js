"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiResponse_1 = __importDefault(require("./application/Helper/apiResponse"));
const UserAgent_1 = __importDefault(require("./application/Helper/UserAgent"));
const api_1 = __importDefault(require("./application/Router/api/v1/api"));
const authenticatedRouter_1 = __importDefault(require("./application/Router/api/v1/authenticatedRouter"));
const app = (0, express_1.default)();
const port = 4000;
app.use(express_1.default.json());
app.post('/test', (req, res) => {
    let body = req.body;
});
app.get('/', (req, res) => {
    const ip = req.ips.length > 0 ? req.ips[0] : req.ip;
    const userAgentNew = new UserAgent_1.default(req).get();
    res.end('s');
    // apiResponse.success(res, 'Welcome to Track My Show API Server 👌', { ip: ip, userAgent: 'userAgent'});
});
app.use('/api/v1/auth', api_1.default);
app.use('/api/v1', authenticatedRouter_1.default);
app.use((req, res) => {
    apiResponse_1.default.notFound(res, 'URL Not Found', []);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
