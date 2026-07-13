export const sendMessage = (res, statusCode, message, success, data=[]) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
}; 