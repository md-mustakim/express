import express, { Request, Response } from 'express';
import {body, validationResult} from "express-validator";
import multer from "multer";
import apiResponse from "../../../Helper/apiResponse";
import HelperFunction from "../../../Helper/HelperFunction";
import Model from "../../../Helper/Model";
import {authenticateRouter} from "./router";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/organizer');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});



authenticateRouter.use(express.static('public'));
authenticateRouter.use(express.static('event'));



authenticateRouter.get('/event', (req: Request, res:Response) => {
    
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

authenticateRouter.get('/event/:id', (req, res) => {
    const organizerEventQuery = 'select * from organizer_events where id = ?';
    const params = [req.params.id];
    Model.first(organizerEventQuery, params).then((result: any) => {
       result.cover =  HelperFunction.env('APP_URL') + '/public/event/' + result.cover;
        apiResponse.success(res, 'Events', result);
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
            if (result) {
                throw new Error('Slug already in use');
            }
        }).catch((err: any) => {

            throw new Error(err.message);
        })}),
    body('description').notEmpty().withMessage('Description is required'),
    body('organizer_id').notEmpty().withMessage('Organizer is required'),
    body('category_id').notEmpty().withMessage('Category is required'),
    body('story').notEmpty().withMessage('Story is required'),

], (req: Request, res: Response) => {
    if(!req.file){
        return apiResponse.validationErrorWithData(res, 'Validation Error', [{message: 'Cover is required'}]);
    }

    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }

    let body = req.body;
    let {name, slug, description, organizer_id, scheduled_at, category_id,  about, story, features_id} = body;
    let cover = req.file.filename;
    
    const organizerEventQuery = 'INSERT INTO `organizer_events`(`name`, `slug`, `description`, `category_id`, `cover`, `scheduled_at`, `about`, `story`, `organizer_id`, `features_id`, `created_by`, `u_a`, `ip`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const organizerEventParams = [name, slug, description, category_id, cover, scheduled_at,  about, story,  organizer_id, features_id,1, req.headers['user-agent'], req.ip, HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];

    Model.queryExecute(organizerEventQuery, organizerEventParams).then((result: any) => {
        
        return apiResponse.success(res, 'Event Create successfully', []);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });
});

authenticateRouter.get('/category', (req, res) => {
    
    const categoryQuery = 'select * from categories order by id desc';
    Model.get(categoryQuery).then((result: any) => {
        apiResponse.success(res, 'All Category', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});

authenticateRouter.post('/category',[
    body('name').notEmpty().withMessage('Name is required'),

],(req: Request, res: Response)=>{
    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let {name} = req.body;
    const categoryQuery = 'INSERT INTO `categories`(`name`, `created_u_a`, `created_ip`, `created_by`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?)';
    const categoryParams = [name, req.headers['user-agent'], req.ip, 1, HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];

    Model.queryExecute(categoryQuery, categoryParams).then((result: any) => {
        return apiResponse.success(res, 'Category Create successfully', [result]);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });
});

authenticateRouter.get('/feature', (req, res) => {
    
    const featureQuery = 'select * from features order by id desc';
    Model.get(featureQuery).then((result: any) => {
        apiResponse.success(res, 'All Feature', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});

authenticateRouter.post('/feature',[
    body('name').notEmpty().withMessage('Name is required'),

],(req: Request, res: Response)=>{
    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let {name} = req.body;
    const featureQuery = 'INSERT INTO `features`(`name`, `created_u_a`, `created_ip`, `created_by`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?)';
    const featureParams = [name, req.headers['user-agent'], req.ip, 1, HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];

    Model.queryExecute(featureQuery, featureParams).then((result: any) => {
        return apiResponse.success(res, 'Feature Create successfully', [result]);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });
});

// district
authenticateRouter.get('/district', (req, res) => {
    
    const districtQuery = 'select * from districts order by id desc';
    Model.get(districtQuery).then((result: any) => {
        apiResponse.success(res, 'All District', result);
    }).catch((err: any) => {
        apiResponse.error(res, 'Error', err);
    });
});


authenticateRouter.post('/district',[
    body('name').notEmpty().withMessage('Name is required'),

],(req: Request, res: Response)=>{
    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let {name} = req.body;
    const districtQuery = 'INSERT INTO `districts`(`name`, `created_u_a`, `created_ip`, `created_by`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?)';
    const districtParams = [name, req.headers['user-agent'], req.ip, 1, HelperFunction.getDateTime(0), HelperFunction.getDateTime(0)];

    Model.queryExecute(districtQuery, districtParams).then((result: any) => {
        return apiResponse.success(res, 'District Create successfully', [result]);
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });
});











authenticateRouter.post('/auth/reset-password/:id', multer().none(), [
    body('new_password').notEmpty().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
    body('confirm_password').custom((value: string, {req}) => {
        let {new_password} = req.body;
        if(value !== new_password){
            throw new Error('Password not match');
        }
        if(value.length < 8){
            throw new Error('Password must be at least 8 characters long.');
        }
        return true;
    })

],(req: Request, res: Response)=>{
    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }

    let userId = [req.params.id];
    let {new_password} = req.body;

    // check user
    const userQuery:string = 'select * from users where id = ?';

    Model.first(userQuery, userId).then((result: any) => {
        if(result == null){
            return apiResponse.notFound(res, 'User not found', []);
        }else {
            let password = Model.passwordHash(new_password);
            let query = "UPDATE users SET password = ?, updated_at = ? WHERE id = ?";
            let params = [password, HelperFunction.getDateTime(0), req.params.id];

            Model.queryExecute(query, params).then((result: any) => {
                if (result.affectedRows > 0) {
                    return apiResponse.success(res, 'Password Reset Successfully', []);
                } else {
                    return apiResponse.error(res, 'Error', []);
                }
            }).catch((err: any) => {
                return apiResponse.error(res, err.message, []);
            });
        }
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });
});


authenticateRouter.post('/auth/change-password', multer().none(), [
    body('current_password').custom(async (value: string, {req}) => {
        let user = req.app.get('user');

        if(!Model.passwordVerify(value, user.password)){
            throw new Error('Current password not match');
        }
        return true;
    }),
    body('new_password').notEmpty().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
    body('confirm_password').custom((value: string, {req}) => {
        let {new_password} = req.body;
        if(value !== new_password){
            throw new Error('Password not match');
        }
        if(value.length < 8){
            throw new Error('Password must be at least 8 characters long.');
        }
        return true;
    })

],(req: Request, res: Response)=>{
    const errors = validationResult(req).formatWith(HelperFunction.validationErrorFormat);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
    }
    let user = req.app.get('user');
    let {new_password} = req.body;
    let password = Model.passwordHash(new_password);
    let query = "UPDATE users SET password = ?, updated_at = ? WHERE id = ?";
    let params = [password, HelperFunction.getDateTime(0), user.id];

    Model.queryExecute(query, params).then((result: any) => {
        if (result.affectedRows > 0) {
            return apiResponse.success(res, 'Password change Successfully', []);
        } else {
            return apiResponse.error(res, 'Error', []);
        }
    }).catch((err: any) => {
        return apiResponse.error(res, err.message, []);
    });
});











export default authenticateRouter;