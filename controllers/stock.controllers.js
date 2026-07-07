 import { addStockService, removeStockService } from '../services/stock.services.js';
 import { sendMessage } from '../utils/responses.utils.js';

 export const addStockController = async (req, res, next) => {
    try {
        const { operations } = req.body;
        const userId = req.user.id;

        const result = await addStockService(res, operations, userId);

        return sendMessage(res, 201, 'Success', true, result);

    } catch (error) {
        next(error);
    }
 };

export const removeStockController = async (req, res, next) => {
    try {
        const { operations } = req.body;
        const userId = req.user.id;

        const result = await removeStockService(res, operations, userId);

        return sendMessage(res, 201, 'Success', true, result);
    } catch (error) {
        next(error);
    }
};