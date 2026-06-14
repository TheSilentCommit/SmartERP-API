export const errorMiddleware = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode;

    if(err.name === 'CastError'){
        error = new Error('Resource not found');
        error.statusCode = 404;
    }

    if(err.code === 11000){
        error = new Error('Duplicate field value entered');
        error.statusCode = 400;
    }

    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new Error(message.join(', '));
        error.statusCode = 400;
    }

    return res.status(error.statusCode || 500).json(
        { 
            success: false, 
            message: error.message || 'Server Error',
            data: null
        }
    );
};