import User from "../models/user.models.js";
import { sendMessage } from "../utils/responses.utils.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        return sendMessage(res, 200, 'OK', true, users);
    } catch (error) {
        return next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if(!user){
            return sendMessage(res, 404, 'User not found', false);
        }

        return sendMessage(res, 200, 'OK', true, user);
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
            return sendMessage(res, 400, 'No valid field for update provided', false);
        }

        const user = await User.findByIdAndUpdate(id, updateData, {returnDocument: 'after', runValidators: true});

        if(!user){
            return sendMessage(res, 404, 'User not found', false);
        }

        return sendMessage(res, 200, 'User updated successfully', true, user);
    } catch (error) {
        return next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if(!user){
            return sendMessage(res, 404, 'User not found', false);
        }

        const data = {
            name: user.name, 
            email: user.email
        };

        return sendMessage(res, 200, 'User deleted successfully', true, data);
    } catch (error) {
        return next(error);
    }
};