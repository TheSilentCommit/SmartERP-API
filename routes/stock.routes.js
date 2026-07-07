import { Router } from "express";

import { addStockController, removeStockController } from "../controllers/stock.controllers";

const stockRouter = Router();

stockRouter.post('/in', addStockController);

stockRouter.post('/out', removeStockController);

stockRouter.get('/history/:id');

stockRouter.get('/balance/:id');

export default stockRouter; 