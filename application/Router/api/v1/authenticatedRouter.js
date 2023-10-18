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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const VerifyToken_1 = require("../../../Middleware/VerifyToken");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const apiResponse_1 = __importDefault(require("../../../Helper/apiResponse"));
const HelperFunction_1 = __importDefault(require("../../../Helper/HelperFunction"));
const authenticateRouter = (0, express_1.Router)();
authenticateRouter.use(express_1.default.urlencoded({ extended: true }));
authenticateRouter.use(express_1.default.json());
authenticateRouter.use(VerifyToken_1.VerifyToken);
authenticateRouter.get('/organizer', (req, res) => {
    res.send('get all organizer');
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/organizer');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
authenticateRouter.use(express_1.default.static('public'));
authenticateRouter.post('/organizer', upload.single('cover'), [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('slug').notEmpty().withMessage('Slug is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(HelperFunction_1.default.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    res.send('create organizer');
});
exports.default = authenticateRouter;
