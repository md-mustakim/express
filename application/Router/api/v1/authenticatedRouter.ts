import express, {  Request, Response,NextFunction, Router } from 'express';
import {VerifyToken} from "../../../Middleware/VerifyToken";
import {body, query, validationResult} from "express-validator";
import multer from "multer";
import apiResponse from "../../../Helper/apiResponse";
import HelperFunction from "../../../Helper/HelperFunction";
import Model from "../../../Helper/Model";


const authenticateRouter: Router = Router();
authenticateRouter.use(VerifyToken);
authenticateRouter.use(express.urlencoded({ extended: true }));
authenticateRouter.use(express.json());

authenticateRouter.get('/user', (req, res) => {
    const allUserQuery = 'select * from users';
    Model.get(allUserQuery).then((result: any) => {
        const users = result.map((user: any) => {
            user.password = undefined;
            return user;
        });
        apiResponse.success(res, 'All User', users);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});
authenticateRouter.get('/organizer', (req, res) => {
    const allUserQuery = 'select * from organizers';
    Model.get(allUserQuery).then((result: any) => {

        result = result.map((organizer: any) => {
            organizer.cover = HelperFunction.env('APP_URL') + '/public/organizer/' + organizer.cover;
            return organizer;
        });

        apiResponse.success(res, 'All Organizer', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/organizer');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

authenticateRouter.use(express.static('public'));
authenticateRouter.use(express.static('event'));

authenticateRouter.post('/organizer',
    upload.single('cover'), [
    body('name').notEmpty().withMessage('Name is required'),
    body('slug').custom(async (value: string) => {
        let query = "SELECT * FROM organizers WHERE slug = ?";
        let params = [value];
        return Model.first(query, params).then((result: any) => {
            if (result.length > 0) {
                throw new Error('Slug already in use');
            }
        }).catch((err: any) => {
            throw new Error(err.message);
        })}),
    body('description').notEmpty().withMessage('Description is required'),
], (req: Request, res: Response) => {
    if(!req.file){
        return apiResponse.validationErrorWithData(res, 'Validation Error', [{message: 'Cover is required'}]);
    }

    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }

    let body = req.body;
    let {name, slug, description, about} = body;
    let cover = req.file.filename;
    console.log(req.file);


    let query = "INSERT INTO organizers (name, slug, description, cover, about, created_u_a, created_ip, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let params = [name, slug, description, cover, about, req.headers['user-agent'], HelperFunction.getIpAddress(req), HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];
    let r = Model.queryExecute(query, params).then((result: any) => {

            console.log(result);
            return apiResponse.success(res, 'Registration is Successful', []);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);

    });
    }
);


authenticateRouter.get('/event', (req, res) => {
    const organizerEventQuery = 'select * from organizer_events order by id desc';
    Model.get(organizerEventQuery).then((result: any) => {
        result = result.map((event: any) => {
            event.cover = HelperFunction.env('APP_URL') + '/public/event/' + event.cover;
            return event;
        });
        apiResponse.success(res, 'All Event', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });

});


authenticateRouter.get('/event-by-organization/:id', (req, res) => {
    const organizerEventQuery = 'select * from organizer_events where organizer_id = ?';
    const params = [req.params.id];
    Model.get(organizerEventQuery, params).then((result: any) => {
        result = result.map((event: any) => {
            event.cover = HelperFunction.env('APP_URL') + '/public/event/' + event.cover;
            return event;
        });
        apiResponse.success(res, 'Events', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });

});



const eventStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/event');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const eventImageUpload = multer({ storage: eventStorage });


authenticateRouter.post('/event', eventImageUpload.single('cover'),[
    body('name').notEmpty().withMessage('Name is required'),
    body('slug').custom(async (value: string) => {
        let query = "SELECT id,slug FROM organizer_events WHERE slug = ?";
        let params = [value];
        return Model.first(query, params).then((result: any) => {
            if (result.length > 0) {
                throw new Error('Slug already in use');
            }
        }).catch((err: any) => {
            throw new Error(err.message);
        })}),
    body('description').notEmpty().withMessage('Description is required'),
    body('organizer_id').notEmpty().withMessage('Organizer is required'),
    body('category_id').notEmpty().withMessage('Category is required'),
    body('ticket_price').notEmpty().withMessage('Ticket Price is required'),
    body('story').notEmpty().withMessage('Story is required'),
    body('venue_id').notEmpty().withMessage('Venue is required'),
    body('features_id').notEmpty().withMessage('Features is required'),


], (req: Request, res: Response) => {
    if(!req.file){
        return apiResponse.validationErrorWithData(res, 'Validation Error', [{message: 'Cover is required'}]);
    }

    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }

    let body = req.body;
    let {name, slug, description, organizer_id, scheduled_at, category_id, ticket_price, about, story, venue_id, features_id} = body;
    let cover = req.file.filename;
    console.log(req.file);
    const organizerEventQuery = 'INSERT INTO `organizer_events`(`name`, `slug`, `description`, `category_id`, `cover`, `scheduled_at`, `ticket_price`, `about`, `story`, `venue_id`, `organizer_id`, `features_id`, `created_by`, `u_a`, `ip`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const organizerEventParams = [name, slug, description, category_id, cover, scheduled_at, ticket_price, about, story, venue_id, organizer_id, features_id,1, req.headers['user-agent'], req.ip, HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];

    Model.queryExecute(organizerEventQuery, organizerEventParams).then((result: any) => {
        console.log(result);
        return apiResponse.success(res, 'Event Create successfully', []);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });
});

authenticateRouter.get('/venue', (req, res) => {
    const venueQuery = 'select * from venues order by id desc';
    Model.get(venueQuery).then((result: any) => {
        apiResponse.success(res, 'All Venue', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});

authenticateRouter.post('/venue',[
    body('name').notEmpty().withMessage('Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
], (req: Request, res: Response) => {

    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }

    let {name, address, latitude, longitude, google_map_url} = req.body;
    const venueQuery = 'INSERT INTO `venues`(`name`, `address`, `latitude`, `longitude`, `google_map_url`, `created_u_a`, `created_ip`, `created_by`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?,?,?,?,?)';
    const venueParams = [name, address, latitude, longitude, google_map_url, req.headers['user-agent'], req.ip, 1, HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];

    Model.queryExecute(venueQuery, venueParams).then((result: any) => {
        return apiResponse.success(res, 'Venue Create successfully', []);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });




});



export default authenticateRouter;