import User from "../models/user.models.js";
import { sendSuccess, sendError } from "../utils/responses.utils.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        return sendSuccess(res, 200, 'OK', users);
    } catch (error) {
        return next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            sendError(404, 'User not found');
        }

        return sendSuccess(res, 200, 'OK', user);
    } catch (error) {
        return next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const allowedFields = ['name', 'email'];

        const updateData = {};

        for(const field of allowedFields){
            if(req.body[field] !== undefined){
                updateData[field] = req.body[field];
            }
        }

        if(Object.keys(updateData).length === 0){
            sendError(400, 'No valid field for update provided');
        }

        const user = await User.findByIdAndUpdate(id, updateData, {returnDocument: 'after', runValidators: true});

        if(!user){
            sendError(404, 'User not found');
        }

        return sendSuccess(res, 200, 'User updated successfully', user);
    } catch (error) {
        return next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if(!user){
            sendError(404, 'User not found');
        }

        return sendSuccess(res, 200, 'User deleted successfully');
    } catch (error) {
        return next(error);
    }
};