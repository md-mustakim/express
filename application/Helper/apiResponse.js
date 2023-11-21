"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiResponse = {
    structure: (res, statusCode, status, data, message) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Expires', '0');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(statusCode).json({
            status,
            message,
            data
        });
    },
    success: (res, message, data) => {
        return apiResponse.structure(res, 200, "Success", data, message);
    },
    created: (res, message, data) => {
        return apiResponse.structure(res, 201, "Created", data, message);
    },
    notFound: (res, message, data) => {
        return apiResponse.structure(res, 404, "Not Found", data, message);
    },
    badRequest: (res, message, data) => {
        return apiResponse.structure(res, 400, "Bad Request", data, message);
    },
    unauthorized: (res, message, data) => {
        return apiResponse.structure(res, 401, "Unauthorized", data, message);
    },
    forbidden: (res, message, data) => {
        return apiResponse.structure(res, 403, "Forbidden", data, message);
    },
    unprocessable: (res, message, data) => {
        return apiResponse.structure(res, 422, "Unprocessable", data, message);
    },
    internalServerError: (res, message, data) => {
        return apiResponse.structure(res, 500, "Internal Server Error", data, message);
    },
    serviceUnavailable: (res, message, data) => {
        return apiResponse.structure(res, 503, "Service Unavailable", data, message);
    },
    validationError: (res, message, data) => {
        return apiResponse.structure(res, 422, "Validation Error", data, message);
    },
    validationErrorWithData: (res, message, data) => {
        return apiResponse.structure(res, 422, "Validation Error", data, message);
    },
    error: (res, message, data) => {
        return apiResponse.structure(res, 500, "Error", data, message);
    }
};
const messages = {
    login: 'Login is Successful.',
    logout: 'Logged out Successfully.',
    register: 'Registration is Successful.',
    validation_error: 'Validation Error',
    inactive: 'You are inactive. Please contact system admin.',
    unauthorized: 'Invalid Credentials',
    delete: 'Deleted Successfully.',
    store: 'Stored Successfully.',
    update: 'Updated Successfully.',
    enable: 'Enabled Successfully.',
    disable: 'Disabled Successfully.',
    dispatch: 'Dispatched Successfully.',
    close: 'Closed Successfully.',
    assign: 'Assigned Successfully.',
    solve: 'Solved Successfully.',
    reopen: 'Reopened Successfully.',
    system_error: 'Something went wrong, Please contact system admin.',
    not_found: 'Not Found',
    fetch_success: 'Fetch Success',
    no_data: 'No Data Found',
    no_permission: 'You do not have permission to perform this action.',
};
exports.default = apiResponse;
