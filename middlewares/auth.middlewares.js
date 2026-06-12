import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.models.js';

const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

export const authorizeGeneral = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization?.startsWith('Bearer ')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return sendError(res, 401, 'Unauthorized');
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user){
            return sendError(res, 401, 'Unauthorized');
        }

        req.user = user;

        next();

    } catch (error) {
        return sendError(res, 401, 'Unauthorized');
    }
};

export const authorizeAdmin = (req, res, next) => {
    if(!req.user.admin){
        return sendError(res, 403, 'Forbidden');
    }

    next();
};

export const authorizeUser = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization?.startsWith('Bearer ')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return sendError(res, 403, 'Forbidden');
        }

        const { id } = req.params;

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user){
            return sendError(res, 404, 'User not found');
        }

        if(user._id.toString() !== id){
            return sendError(res, 403, 'Forbidden');
        }

        return next();
    } catch (error) {
        return sendError(res, 403, 'Forbidden');
    }
};

export const authorizeAdminOrOwner = (req, res, next) => {
    const { id } = req.params;

    if(req.user.admin || req.user._id.toString() === id){
        return next();
    }
    
    return sendError(res, 403, 'Forbidden');
};