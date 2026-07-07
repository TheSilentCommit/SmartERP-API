import { Router } from "express";

import { addStockController, removeStockController } from "../controllers/stock.controllers.js";
import { authorizeGeneral } from "../middlewares/auth.middlewares.js";

const stocksRouter = Router();

// api/v1/stocks/in
stocksRouter.post('/in', authorizeGeneral, addStockController);

// api/v1/stocks/out
stocksRouter.post('/out', authorizeGeneral, removeStockController);

stocksRouter.post('/adjust');

stocksRouter.get('/history');

stocksRouter.get('/history/:sku');

stocksRouter.get('/balance');

stocksRouter.get('/balance/:sku');

export default stocksRouter; 