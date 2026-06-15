import { Router } from "express";
import { 
    createProduct, deleteProduct, getProduct, getProducts, updateProduct 
} from "../controllers/product.controllers.js";

const productRouter = Router();

productRouter.get('/', getProducts);

productRouter.get('/:id', getProduct);

productRouter.put('/:id', updateProduct);

productRouter.post('/', createProduct);

productRouter.delete('/:id', deleteProduct);

export default productRouter;