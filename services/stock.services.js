import mongoose from "mongoose";

import Product from '../models/product.models.js';
import StockMovement from "../models/stockMovement.models.js";
import { sendMessage } from '../utils/responses.utils.js';

const addStock = async (res, operations, userId) => {
    if(!Array.isArray(operations)){
        return sendMessage(res, 400, 'Operations must be an array');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const movement = [];

        for(const operation of operations){
            const { 
                product,
             } = operation;
        }
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        next(error);
    }
};