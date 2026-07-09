 import { addStockService, removeStockService, adjustStockService, historyStockService } from '../services/stock.services.js';
 import { sendMessage } from '../utils/responses.utils.js';

 export const addStockController = async (req, res, next) => {
    try {
        const { operations } = req.body;

        const userId = req.user.id;

        const result = await addStockService(operations, userId);

        return sendMessage(res, result.code, result.message, result.success, result.data);

    } catch (error) {
        next(error);
    }
 };

export const removeStockController = async (req, res, next) => {
    try {
        const { operations } = req.body;
        const userId = req.user.id;

        const result = await removeStockService(operations, userId);

        return sendMessage(res, result.code, result.message, result.success, result.data);
    } catch (error) {
        next(error);
    }
};

export const adjustStockController = async (req, res, next) => {
    try {
        const { operations } = req.body;
        const userId = req.user.id;

        const result = await adjustStockService(operations, userId);

        return sendMessage(res, result.code, result.message, result.success, result.data);
    } catch (error) {
        next(error);
    }
};

export const historyStockController = async (req, res, next) => {
    try {
        const result = await historyStockService();

        return sendMessage(res, result.code, result.message, result.success, result.data);
    } catch (error) {
        next(error);
    }
};