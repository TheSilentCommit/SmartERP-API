import { Router } from "express";
import { createProduct, getProduct, getProducts } from "../controllers/product.controllers.js";

const productRouter = Router();

productRouter.get('/', getProducts);

productRouter.get('/:id', getProduct);

productRouter.put('/:id');

productRouter.post('/', createProduct);

productRouter.delete('/:id');

export default productRouter;