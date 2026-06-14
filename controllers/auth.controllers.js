import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from '../models/user.models.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import { sendError, sendSuccess } from "../utils/responses.utils.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password, admin } = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            return sendError(409, 'E-mail already registered');
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{name, email, password: hashedPassword, admin: admin}], {session});

        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        return sendSuccess(res, 201, 'User created successfully', { token, user: newUser[0] });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const sigIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email}).select('+password');
        
        if(!user){
            return sendError(404, 'User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return sendError(401, 'Invalid password');
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        const userSafe = user.toObject();
        delete userSafe.password;

        return sendSuccess(res, 200, 'User sign in successfully', { token, userSafe });

    } catch (error){
        next(error);
    }
};