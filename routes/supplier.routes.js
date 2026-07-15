import { Router } from "express";

import {
    getSupplierController,
    getSuppliersController,
    createSuppliersController,
    updateSupplierController,
    deleteSupplierController
} from '../controllers/supplier.controllers.js';

import { authorizeGeneral } from "../middlewares/auth.middlewares.js";

const supplierRouter = Router();

supplierRouter.get('/', getSuppliersController);

supplierRouter.get('/:id', getSupplierController);

supplierRouter.post('/', authorizeGeneral, createSuppliersController);

supplierRouter.put('/:id', authorizeGeneral, updateSupplierController);

supplierRouter.delete('/:id', authorizeGeneral, deleteSupplierController);

export default supplierRouter;