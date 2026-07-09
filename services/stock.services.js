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
        return {code: 400, message: 'Operations must be an array', success: false, data: []};
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

                return {
                    code: 400, 
                    message: 'Invalid quantity. Must be greater than 0', 
                    success: false, 
                    data: []
                };
            }

            const productDoc = await Product.findById(product).session(session);

            if(!productDoc){
                await session.abortTransaction();

                return {code: 404, message: 'Product not found', success: false, data: []};
            }

            if(!unitCost || unitCost < 0){
                await session.abortTransaction();

                return {code: 400, message: 'Unit cost must be greater than 0', success: false, data: []};
            }

            if(!unitPrice || unitPrice < 0){
                await session.abortTransaction();

                return {code: 400, message: 'Unit price must be greater than 0', success: false, data: []};
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

                return {code: 400, message: 'Invalid quantity. Not enough stock', success: false, data: []};
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

export const adjustStockService = async (operations, userId) => {
    if(!Array.isArray(operations)){
        return {code: 400, message: 'Operations must be an array', success: false, data: []};
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const movements = [];
        const balances = {};

        for(const operation of operations){
            const {
                product: productId,
                newBalance,
                reason = null,
                referenceType = 'MANUAL',
                metadata = {}
            } = operation;

            if(typeof newBalance !== 'number' || newBalance < 0 || Number.isNaN(newBalance)){
                await session.abortTransaction();

                return {
                    code: 400, message: 'Invalid new balance. Must be a number greater than or equal to 0', 
                    success: false, 
                    data: []
                };
            }

            const product = await Product.findById(productId).session(session);

            if(!product){
                await session.abortTransaction();

                return {code: 404, message: 'Product not found', success: false, data: []};
            }

            let currentBalance;

            if(balances[productId] !== undefined){
                currentBalance = balances[productId];
            } else {
                const lastMovement = await StockMovement.findOne({ product: productId })
                .sort({ createdAt: -1}).session(session);

                currentBalance = lastMovement?.balanceAfter ?? 0;
            }

            const difference = newBalance - currentBalance;

            if(difference === 0){
                continue;
            }

            balances[productId] = newBalance;

            movements.push({
                product: productId,
                type: 'ADJUSTMENT',
                quantity: Math.abs(difference),
                balanceAfter: newBalance,
                reason,
                referenceType,
                createdBy: userId,
                metadata: {
                    inventoryCount: newBalance,
                    previousBalance: currentBalance,
                    difference
                }
            });

        }

        if(movements.length === 0){
            await session.commitTransaction();

            return {code: 200, message: 'No stock adjustments were necessary', success: true, data: []};
        }

        const createdMovements = await StockMovement.insertMany(movements, {session});

        await session.commitTransaction();

        return {
            code: 201, 
            message: 'Stock movement created successfully', 
            success: true, 
            data: createdMovements
        };

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const historyStockService = async () => {
    try {
        const movements = await StockMovement.find().sort({ createdAt: -1 });

        return {code: 200, message: 'Stock movements history', success: true, data: movements};

    } catch (error) {
        throw error;
    }
};