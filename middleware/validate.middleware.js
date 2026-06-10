

export const validateFields = (fields) => {
    return (req, res, next) => {
        for(const field of fields){
            if(!req.body[field] && field !== 'admin'){
                const error = new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                error.statusCode = 400;
                return next(error);
            }
        }

        next();
    };
};