import mongoose from "mongoose";

import Product from '../models/product.models.js';
import StockMovement from "../models/stockMovement.models.js";
import { sendMessage } from '../utils/responses.utils.js';

export const addStockService = async (res, operations, userId) => {
    if(!Array.isArray(operations)){
        return sendMessage(res, 400, 'Operations must be an array', false);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const movements = [];

        const balances = {};

        for(const operation of operations){
            const { 
                productId,
                quantity,
                reason = null,
                referenceType = 'MANUAL',
                referenceId = null,
                unitCost = null
            } = operation;

            if(!quantity || quantity <= 0){
                // Change this to skip this operation to the next one
                return sendMessage(res, 400, 'Invalid quantity. Must be greater than 0', false);
            }

            const product = await Product.findById(productId).session(session);

            if(!product){
                return sendMessage(res, 404, 'Product not found', false);
            }

            let currentBalance;

            if(balances[productId] !== undefined){
                currentBalance = balances[productId];
            } else{
                const lastMovement = await StockMovement.findOne({ product: productId })
                .sort({ createdAt: -1 }).session(session);
                
                currentBalance = lastMovement?.balanceAfter ?? 0;
            }

            const balanceAfter = currentBalance + quantity;

            balances[productId] = balanceAfter;

            movements.push({
                product: productId,
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
        
        return createdMovements;

    } catch (error) {
        session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const removeStockService = async (res, operations, userId) => {
    if(!Array.isArray(operations)){
        return sendMessage(res, 400, 'Operations must be an array', false);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const movements = [];
        const balances = {};

        for(const operetaion of operations){
            const {
                productId,
                quantity,
                reason = null,
                referenceType = 'MANUAL',
                referenceId = null,
                unitCost = null
            } = operation;
        }

        if(!quantity || quantity <= 0){
            // Change this to skip this operation to the next one
            return sendMessage(res, 400, 'Invalid quantity. Must be greater than 0', false);
        }

        let currentBalance;

        if(balances[productId] !== undefined){
            currentBalance = balances[productId];
        } else{
            const lastMovement = await StockMovement.findOne({ product: productId })
            .sort({ createdAt: -1 }).session({ session });

            currentBalance = lastMovement?.balanceAfter ?? 0;
        }

        const balanceAfter = currentBalance - quantity;

        if(!balanceAfter || balanceAfter < 0){
            // Change this to skip this operation to the next one
            return sendMessage(res, 400, 'Invalid quantity. Not enough stock');
        }

        balances[productId] = balanceAfter;

        movements.push({
            product: productId,
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

        const createdMovements = await StockMovement.insertMany(movements, {session});

        await session.commitTransaction();

        return createdMovements;

    } catch (error) {
        session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};