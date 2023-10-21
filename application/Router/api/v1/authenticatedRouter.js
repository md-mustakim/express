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
const express_1 = __importStar(require("express"));
const VerifyToken_1 = require("../../../Middleware/VerifyToken");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const apiResponse_1 = __importDefault(require("../../../Helper/apiResponse"));
const HelperFunction_1 = __importDefault(require("../../../Helper/HelperFunction"));
const Model_1 = __importDefault(require("../../../Helper/Model"));
const authenticateRouter = (0, express_1.Router)();
authenticateRouter.use(VerifyToken_1.VerifyToken);
authenticateRouter.use(express_1.default.urlencoded({ extended: true }));
authenticateRouter.use(express_1.default.json());
authenticateRouter.get('/user', (req, res) => {
    const allUserQuery = 'select * from users';
    Model_1.default.get(allUserQuery).then((result) => {
        const users = result.map((user) => {
            user.password = undefined;
            return user;
        });
        apiResponse_1.default.success(res, 'All User', users);
    }).catch((err) => {
        apiResponse_1.default.error(res, 'Error', err);
    });
});
authenticateRouter.get('/organizer', (req, res) => {
    const allUserQuery = 'select * from organizers';
    Model_1.default.get(allUserQuery).then((result) => {
        result = result.map((organizer) => {
            organizer.cover = HelperFunction_1.default.env('APP_URL') + '/public/organizer/' + organizer.cover;
            return organizer;
        });
        apiResponse_1.default.success(res, 'All Organizer', result);
    }).catch((err) => {
        apiResponse_1.default.error(res, 'Error', err);
    });
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
    (0, express_validator_1.body)('slug').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        let query = "SELECT * FROM organizers WHERE slug = ?";
        let params = [value];
        return Model_1.default.first(query, params).then((result) => {
            if (result.length > 0) {
                throw new Error('Slug already in use');
            }
        }).catch((err) => {
            throw new Error(err.message);
        });
    })),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
], (req, res) => {
    if (!req.file) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', [{ message: 'Cover is required' }]);
    }
    const errors = (0, express_validator_1.validationResult)(req).formatWith(HelperFunction_1.default.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let body = req.body;
    let { name, slug, description, about } = body;
    let cover = req.file.filename;
    console.log(req.file);
    let query = "INSERT INTO organizers (name, slug, description, cover, about, created_u_a, created_ip, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let params = [name, slug, description, cover, about, req.headers['user-agent'], HelperFunction_1.default.getIpAddress(req), HelperFunction_1.default.getDateTime(0), HelperFunction_1.default.getDateTime(0)];
    let r = Model_1.default.queryExecute(query, params).then((result) => {
        console.log(result);
        return apiResponse_1.default.success(res, 'Registration is Successful', []);
    }).catch((err) => {
        return apiResponse_1.default.error(res, err.message, []);
    });
});
exports.default = authenticateRouter;
