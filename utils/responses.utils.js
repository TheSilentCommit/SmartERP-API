export const sendMessage = (res, statusCode, message, success, data=null) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
};