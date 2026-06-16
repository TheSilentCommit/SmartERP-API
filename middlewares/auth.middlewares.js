import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.js';
import { sendMessage } from '../utils/responses.utils.js';
import User from '../models/user.models.js';

export const authorizeGeneral = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization?.startsWith('Bearer ')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return sendMessage(res, 401, 'Unauthorized', false);
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user){
            return sendMessage(res, 401, 'Unauthorized', false);
        }

        req.user = user;

        next();

    } catch (error) {
        return sendMessage(res, 401, 'Unauthorized', false);
    }
};

export const authorizeAdmin = (req, res, next) => {
    const { admin } = req.user.admin;

    if(!admin){
        return sendMessage(res, 403, 'Forbidden', false);
    }

    next();
};

export const authorizeOwner = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization?.startsWith('Bearer ')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return sendMessage(res, 403, 'Forbidden', false);
        }

        const { id } = req.params;

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user){
            return sendMessage(res, 404, 'User not found', false);
        }

        if(user._id.toString() !== id){
            return sendMessage(res, 403, 'Forbidden', false);
        }

        return next();
    } catch (error) {
        return sendMessage(res, 403, 'Forbidden', false);
    }
};

export const authorizeAdminOrOwner = (req, res, next) => {
    const { paramsId } = req.params;
    const { userId } = req.user._id.toString();
    const { admin } = req.user.admin;

    if(admin || userId === paramsId){
        return next();
    } 
    
    return sendMessage(res, 403, 'Forbidden', false);
};