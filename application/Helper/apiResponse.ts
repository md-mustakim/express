const apiResponse = {
    success: (res: any, data: any, message: string) => {
        const result = {
            status: 200,
            message,
            data
        };
        return res.status(200).json(result);
    }
}

export default apiResponse;