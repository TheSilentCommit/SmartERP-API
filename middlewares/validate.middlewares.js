import { sendMessage } from "../utils/responses.utils.js";

export const validateFields = (fields) => {
    return (req, res, next) => {
        for(const field of fields){
            if(!req.body[field]){
                sendMessage(res, 400, `User ${field.charAt(0).toUpperCase() + field.slice(1)}
                 is required`, false);
            }
        }

        next();
    };
};