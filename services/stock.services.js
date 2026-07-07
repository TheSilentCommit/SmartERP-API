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
                unitPrice = null,
                metadata = {}
            } = operation;

            if(!quantity || quantity <= 0){
                await session.abortTransaction();

                return {code: 400, message: 'Invalid quantity. Must be greater than 0', success: false, data: null};
            }

            const productDoc = await Product.findById(product).session(session);

            if(!productDoc){
                await session.abortTransaction();

                return {code: 404, message: 'Product not found', success: false, data: null};
            }

            let currentBalance;

            if(balances[product] !== undefined){
                currentBalance = balances[product];
            } else{
                const lastMovement = await StockMovement.findById(product)
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
                unitPrice,
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

export const removeStockService = async (operations, userId) => {
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
                unitCost = null,
                unitPrice = null,
                metadata = {}
            } = operation;

            if(!quantity || quantity <= 0){
                await session.abortTransaction();

                return {code: 400, message: 'Invalid quantity. Must be greater than 0', success: false, data: null};
            }

            const productDoc = await Product.findById(product).session(session);

            if(!productDoc){
                await session.abortTransaction();

                return {code: 404, message: 'Product not found', success: false, data: null};
            }

            if(!unitCost || unitCost < 0){
                await session.abortTransaction();

                return {code: 400, message: 'Unit cost must be greater than 0', success: false, data: null};
            }

            if(!unitPrice || unitPrice < 0){
                await session.abortTransaction();

                return {code: 400, message: 'Unit price must be greater than 0', success: false, data: null};
            }

            let currentBalance;

            if(balances[product] !== undefined){
                currentBalance = balances[product];
            } else{
                const lastMovement = await StockMovement.findOne({ product })
                .sort({ createdAt: -1 }).session(session);

                currentBalance = lastMovement?.balanceAfter ?? 0;
            }

            const balanceAfter = currentBalance - quantity;

            if(balanceAfter < 0){
                await session.abortTransaction();

                return {code: 400, message: 'Invalid quantity. Not enough stock', success: false, data: null};
            }

            balances[product] = balanceAfter;

            movements.push({
                product: product,
                type: 'OUT',
                quantity,
                balanceAfter,
                reason,
                referenceType,
                referenceId,
                unitCost,
                unitPrice,
                createdBy: userId,
                metadata
            });
        }

        const createdMovements = await StockMovement.insertMany(movements, {session});

        await session.commitTransaction();

        return {code: 201, message: 'Stock movement created successfully', success: true, data: createdMovements};

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};