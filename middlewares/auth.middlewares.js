import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.js';
import { sendError } from '../utils/responses.utils.js';
import User from '../models/user.models.js';

export const authorizeGeneral = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization?.startsWith('Bearer ')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            sendError(401, 'Unauthorized');
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user){
            sendError(401, 'Unauthorized');
        }

        req.user = user;

        next();

    } catch (error) {
        sendError(401, 'Unauthorized');
    }
};

export const authorizeAdmin = (req, res, next) => {
    const { admin } = req.user.admin;

    if(!admin){
        sendError(403, 'Forbidden');
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
            sendError(403, 'Forbidden');
        }

        const { id } = req.params;

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user){
            sendError(404, 'User not found');
        }

        if(user._id.toString() !== id){
            sendError(403, 'Forbidden');
        }

        return next();
    } catch (error) {
        sendError(403, 'Forbidden');
    }
};

export const authorizeAdminOrOwner = (req, res, next) => {
    const { paramsId } = req.params;
    const { userId } = req.user._id.toString();
    const { admin } = req.user.admin;

    if(admin || userId === paramsId){
        return next();
    }
    
    sendError(403, 'Forbidden');
};