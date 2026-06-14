import { Router } from "express";

const stockRouter = Router();

stockRouter.post('/in');

stockRouter.post('/out');

stockRouter.get('/history/:id');

stockRouter.get('/balance/:id');

export default stockRouter;