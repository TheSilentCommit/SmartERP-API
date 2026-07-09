import { Router } from "express";

import { 
    addStockController, adjustStockController, historyStockController, removeStockController 
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
stocksRouter.get('/history', historyStockController);

// api/v1/stocks/history/:sku
stocksRouter.get('/history/:sku');

// api/v1/stocks/balance
stocksRouter.get('/balance');

// api/v1/stocks/balance/:sku
stocksRouter.get('/balance/:sku');

export default stocksRouter; 