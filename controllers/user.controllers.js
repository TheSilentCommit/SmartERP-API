import User from "../models/user.models.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error);
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
            const error = new Error('No valid field for update provided');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findByIdAndUpdate(id, updateData, {returnDocument: 'after', runValidators: true});

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: {
                user
            }
        })
    } catch (error) {
        next(error);
    }
}