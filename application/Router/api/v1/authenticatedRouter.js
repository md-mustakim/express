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
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const apiResponse_1 = __importDefault(require("../../../Helper/apiResponse"));
const HelperFunction_1 = __importDefault(require("../../../Helper/HelperFunction"));
const Model_1 = __importDefault(require("../../../Helper/Model"));
const router_1 = require("./router");
router_1.authenticateRouter.get('/user', (req, res) => {
    console.info(req);
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
router_1.authenticateRouter.get('/organizer', (req, res) => {
    console.info(req);
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
        console.info(req, file);
        cb(null, 'public/organizer');
    },
    filename: function (req, file, cb) {
        console.info(req);
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router_1.authenticateRouter.use(express_1.default.static('public'));
router_1.authenticateRouter.use(express_1.default.static('event'));
router_1.authenticateRouter.post('/organizer', upload.single('cover'), [
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
    Model_1.default.queryExecute(query, params).then((result) => {
        console.log(result);
        return apiResponse_1.default.success(res, 'Registration is Successful', []);
    }).catch((err) => {
        return apiResponse_1.default.error(res, err.message, []);
    });
});
router_1.authenticateRouter.get('/event', (req, res) => {
    console.info(req);
    const organizerEventQuery = 'select * from organizer_events order by id desc';
    Model_1.default.get(organizerEventQuery).then((result) => {
        result = result.map((event) => {
            event.cover = HelperFunction_1.default.env('APP_URL') + '/public/event/' + event.cover;
            return event;
        });
        apiResponse_1.default.success(res, 'All Event', result);
    }).catch((err) => {
        apiResponse_1.default.error(res, 'Error', err);
    });
});
router_1.authenticateRouter.get('/event-by-organization/:id', (req, res) => {
    const organizerEventQuery = 'select * from organizer_events where organizer_id = ?';
    const params = [req.params.id];
    Model_1.default.get(organizerEventQuery, params).then((result) => {
        result = result.map((event) => {
            event.cover = HelperFunction_1.default.env('APP_URL') + '/public/event/' + event.cover;
            return event;
        });
        apiResponse_1.default.success(res, 'Events', result);
    }).catch((err) => {
        apiResponse_1.default.error(res, 'Error', err);
    });
});
const eventStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        console.info(req, file);
        cb(null, 'public/event');
    },
    filename: function (req, file, cb) {
        console.info(req);
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const eventImageUpload = (0, multer_1.default)({ storage: eventStorage });
router_1.authenticateRouter.post('/event', eventImageUpload.single('cover'), [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('slug').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        let query = "SELECT id,slug FROM organizer_events WHERE slug = ?";
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
    (0, express_validator_1.body)('organizer_id').notEmpty().withMessage('Organizer is required'),
    (0, express_validator_1.body)('category_id').notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('ticket_price').notEmpty().withMessage('Ticket Price is required'),
    (0, express_validator_1.body)('story').notEmpty().withMessage('Story is required'),
    (0, express_validator_1.body)('venue_id').notEmpty().withMessage('Venue is required'),
    (0, express_validator_1.body)('features_id').notEmpty().withMessage('Features is required'),
], (req, res) => {
    if (!req.file) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', [{ message: 'Cover is required' }]);
    }
    const errors = (0, express_validator_1.validationResult)(req).formatWith(HelperFunction_1.default.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let body = req.body;
    let { name, slug, description, organizer_id, scheduled_at, category_id, ticket_price, about, story, venue_id, features_id } = body;
    let cover = req.file.filename;
    console.log(req.file);
    const organizerEventQuery = 'INSERT INTO `organizer_events`(`name`, `slug`, `description`, `category_id`, `cover`, `scheduled_at`, `ticket_price`, `about`, `story`, `venue_id`, `organizer_id`, `features_id`, `created_by`, `u_a`, `ip`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const organizerEventParams = [name, slug, description, category_id, cover, scheduled_at, ticket_price, about, story, venue_id, organizer_id, features_id, 1, req.headers['user-agent'], req.ip, HelperFunction_1.default.getDateTime(0), HelperFunction_1.default.getDateTime(0)];
    Model_1.default.queryExecute(organizerEventQuery, organizerEventParams).then((result) => {
        console.log(result);
        return apiResponse_1.default.success(res, 'Event Create successfully', []);
    }).catch((err) => {
        return apiResponse_1.default.error(res, err.message, []);
    });
});
router_1.authenticateRouter.get('/venue', (req, res) => {
    console.info(req);
    const venueQuery = 'select * from venues order by id desc';
    Model_1.default.get(venueQuery).then((result) => {
        apiResponse_1.default.success(res, 'All Venue', result);
    }).catch((err) => {
        apiResponse_1.default.error(res, 'Error', err);
    });
});
router_1.authenticateRouter.post('/venue', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('address').notEmpty().withMessage('Address is required'),
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(HelperFunction_1.default.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let { name, address, latitude, longitude, google_map_url } = req.body;
    const venueQuery = 'INSERT INTO `venues`(`name`, `address`, `latitude`, `longitude`, `google_map_url`, `created_u_a`, `created_ip`, `created_by`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?,?,?,?,?)';
    const venueParams = [name, address, latitude, longitude, google_map_url, req.headers['user-agent'], req.ip, 1, HelperFunction_1.default.getDateTime(0), HelperFunction_1.default.getDateTime(0)];
    Model_1.default.queryExecute(venueQuery, venueParams).then((result) => {
        return apiResponse_1.default.success(res, 'Venue Create successfully', [result]);
    }).catch((err) => {
        return apiResponse_1.default.error(res, err.message, []);
    });
});
router_1.authenticateRouter.get('/category', (req, res) => {
    console.info(req);
    const categoryQuery = 'select * from categories order by id desc';
    Model_1.default.get(categoryQuery).then((result) => {
        apiResponse_1.default.success(res, 'All Category', result);
    }).catch((err) => {
        apiResponse_1.default.error(res, 'Error', err);
    });
});
router_1.authenticateRouter.post('/category', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(HelperFunction_1.default.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let { name } = req.body;
    const categoryQuery = 'INSERT INTO `categories`(`name`, `created_u_a`, `created_ip`, `created_by`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?)';
    const categoryParams = [name, req.headers['user-agent'], req.ip, 1, HelperFunction_1.default.getDateTime(0), HelperFunction_1.default.getDateTime(0)];
    Model_1.default.queryExecute(categoryQuery, categoryParams).then((result) => {
        return apiResponse_1.default.success(res, 'Category Create successfully', [result]);
    }).catch((err) => {
        return apiResponse_1.default.error(res, err.message, []);
    });
});
router_1.authenticateRouter.get('/feature', (req, res) => {
    console.info(req);
    const featureQuery = 'select * from features order by id desc';
    Model_1.default.get(featureQuery).then((result) => {
        apiResponse_1.default.success(res, 'All Feature', result);
    }).catch((err) => {
        apiResponse_1.default.error(res, 'Error', err);
    });
});
router_1.authenticateRouter.post('/feature', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(HelperFunction_1.default.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let { name } = req.body;
    const featureQuery = 'INSERT INTO `features`(`name`, `created_u_a`, `created_ip`, `created_by`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?)';
    const featureParams = [name, req.headers['user-agent'], req.ip, 1, HelperFunction_1.default.getDateTime(0), HelperFunction_1.default.getDateTime(0)];
    Model_1.default.queryExecute(featureQuery, featureParams).then((result) => {
        return apiResponse_1.default.success(res, 'Feature Create successfully', [result]);
    }).catch((err) => {
        return apiResponse_1.default.error(res, err.message, []);
    });
});
// district
router_1.authenticateRouter.get('/district', (req, res) => {
    console.info(req);
    const districtQuery = 'select * from districts order by id desc';
    Model_1.default.get(districtQuery).then((result) => {
        apiResponse_1.default.success(res, 'All District', result);
    }).catch((err) => {
        apiResponse_1.default.error(res, 'Error', err);
    });
});
router_1.authenticateRouter.post('/district', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(HelperFunction_1.default.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse_1.default.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let { name } = req.body;
    const districtQuery = 'INSERT INTO `districts`(`name`, `created_u_a`, `created_ip`, `created_by`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?)';
    const districtParams = [name, req.headers['user-agent'], req.ip, 1, HelperFunction_1.default.getDateTime(0), HelperFunction_1.default.getDateTime(0)];
    Model_1.default.queryExecute(districtQuery, districtParams).then((result) => {
        return apiResponse_1.default.success(res, 'District Create successfully', [result]);
    }).catch((err) => {
        return apiResponse_1.default.error(res, err.message, []);
    });
});
exports.default = router_1.authenticateRouter;
