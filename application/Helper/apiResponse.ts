import {Response} from "express";

const apiResponse = {
    structure: ( res: Response, statusCode: number, status: string, data: any, message: string) => {
        return res.status(statusCode).json({
            status,
            message,
            data
        });
    },
    success: (res: Response, data: any, message: string) => {
        return apiResponse.structure(res, 200, "Success", data, message);
    },
    created: (res: Response, data: any, message: string) => {
        return apiResponse.structure(res, 201, "Created", data, message);
    },
    notFound: (res: Response, data: any, message: string) => {
       return apiResponse.structure(res, 404, "Not Found", data, message);
    },
    badRequest: (res: Response, data: any, message: string) => {
        return apiResponse.structure(res, 400, "Bad Request", data, message);
    },
    unauthorized: (res: Response, data: any, message: string) => {
        return apiResponse.structure(res, 401, "Unauthorized", data, message);
    }
}

export default apiResponse;