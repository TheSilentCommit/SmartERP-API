import { Router } from "express";

import {
    getSupplierController,
    getSuppliersController,
    createSuppliersController,
    updateSupplierController,
    deleteSupplierController
} from '../controllers/supplier.controllers.js';

const supplierRouter = Router();

supplierRouter.get('/', getSuppliersController);

supplierRouter.get('/:id', getSupplierController);

supplierRouter.post('/', createSuppliersController);

supplierRouter.put('/:id', updateSupplierController);

supplierRouter.delete('/:id', deleteSupplierController);

export default supplierRouter;