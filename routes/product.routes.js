import { Router } from "express";
import { 
    createProduct, deleteProduct, getProduct, getProducts, updateProduct 
} from "../controllers/product.controllers.js";
import { authorizeAdmin, authorizeGeneral } from "../middlewares/auth.middlewares.js";

const productRouter = Router();

productRouter.get('/', authorizeGeneral, getProducts);

productRouter.get('/:id', authorizeGeneral, getProduct);

productRouter.put('/:id', authorizeAdmin, updateProduct);

productRouter.post('/', authorizeAdmin, createProduct);

productRouter.delete('/:id', authorizeAdmin, deleteProduct);

export default productRouter;