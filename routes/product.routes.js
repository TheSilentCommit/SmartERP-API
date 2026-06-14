import { Router } from "express";

const productRouter = Router();

productRouter.get('/');

productRouter.get('/:id');

productRouter.put('/:id');

productRouter.post('/');

productRouter.delete('/:id');

export default productRouter;