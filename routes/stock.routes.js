import { Router } from "express";

import { 
    addStockController, 
    adjustStockController, 
    getBalanceController, 
    getProductBalanceByIdController, 
    getProductHistoryByIdController, 
    getProductHistoryController, 
    removeStockController,
} from "../controllers/stock.controllers.js";
import { authorizeGeneral } from "../middlewares/auth.middlewares.js";

const stocksRouter = Router();

// api/v1/stocks/in
stocksRouter.post('/in', authorizeGeneral, addStockController);

// api/v1/stocks/out
stocksRouter.post('/out', authorizeGeneral, removeStockController);

// api/v1/stocks/adjust
stocksRouter.post('/adjust', authorizeGeneral, adjustStockController);

// api/v1/stocks/history
stocksRouter.get('/history', authorizeGeneral, getProductHistoryController);

// api/v1/stocks/history/:sku
stocksRouter.get('/history/:id', authorizeGeneral, getProductHistoryByIdController);

// api/v1/stocks/balance
stocksRouter.get('/balance', getBalanceController);

// api/v1/stocks/balance/:sku
stocksRouter.get('/balance/:id', getProductBalanceByIdController);

export default stocksRouter; 