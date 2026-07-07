import mongoose from "mongoose";

import Product from '../models/product.models.js';
import StockMovement from "../models/stockMovement.models.js";
import { sendMessage } from '../utils/responses.utils.js';

export const addStockService = async (operations, userId) => {
    if(!Array.isArray(operations)){
        return { code: 400, message: 'Operations must be an array', success: false, data: null};
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const movements = [];

        const balances = {};

        for(const operation of operations){
            const { 
                product,
                quantity,
                reason = null,
                referenceType = 'MANUAL',
                referenceId = null,
                unitCost = null,
                metadata = {}
            } = operation;

            if(!quantity || quantity <= 0){
                // Change this to skip this operation to the next one
                return {code: 400, message: 'Invalid quantity. Must be greater than 0', success: false, data: null};
            }

            const productExists = await Product.findById(product).session(session);

            if(!productExists){
                return {code: 404, message: 'Product not found', success: false, data: null};
            }

            let currentBalance;

            if(balances[product] !== undefined){
                currentBalance = balances[product];
            } else{
                const lastMovement = await StockMovement.findOne({ product: product })
                .sort({ createdAt: -1 }).session(session);
                
                currentBalance = lastMovement?.balanceAfter ?? 0;
            }

            const balanceAfter = currentBalance + quantity;

            balances[product] = balanceAfter;

            movements.push({
                product: product,
                type: 'IN',
                quantity,
                balanceAfter,
                reason,
                referenceType,
                referenceId,
                unitCost,
                createdBy: userId,
                metadata
            });
        }

        const createdMovements = await StockMovement.insertMany(movements, { session });

        await session.commitTransaction();

        return {code: 201, message: 'Success', success: true, data: createdMovements};

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const removeStockService = async (res, operations, userId, next) => {
    if(!Array.isArray(operations)){
        return {code: 400, message: 'Operations must be an array', success: false, data: null};
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const movements = [];
        const balances = {};

        for(const operation of operations){
            const {
                product,
                quantity,
                reason = null,
                referenceType = 'MANUAL',
                referenceId = null,
                unitCost = null
            } = operation;

            if(!quantity || quantity <= 0){
                // Change this to skip this operation to the next one
                return {code: 400, message: 'Invalid quantity. Must be greater than 0', success: false, data: null};
            }

            const productExists = await Product.findById(product).session(session);

            if(!productExists){
                return {code: 404, message: 'Product not found', success: false, data: null};
            }

            let currentBalance;

            if(balances[product] !== undefined){
                currentBalance = balances[productId];
            } else{
                const lastMovement = await StockMovement.findOne({ product: product })
                .sort({ createdAt: -1 }).session({ session });

                currentBalance = lastMovement?.balanceAfter ?? 0;
            }

            const balanceAfter = currentBalance - quantity;

            if(!balanceAfter || balanceAfter < 0){
                // Change this to skip this operation to the next one
                return {code: 400, message: 'Invalid quantity. Not enough stock', success: false, data: null};
            }

            balances[product] = balanceAfter;

            movements.push({
                product: product,
                type: 'IN',
                quantity,
                balanceAfter,
                reason,
                referenceType,
                referenceId,
                unitCost,
                createdBy: userId,
                metadata
            });
        }

        const createdMovements = await StockMovement.insertMany(movements, {session});

        await session.commitTransaction();

        return {code: 201, message: '', success: true, data: createdMovements};

    } catch (error) {
        session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};