import mongoose from 'mongoose';

import {
    getSupplierController,
    getSuppliersController,
    createSuppliersController,
    updateSupplierController,
    deleteSupplierController
} from '../controllers/supplier.controllers.js';

import Supplier from '../models/supplier.models.js';

export const getSuppliersService = async () => {
    try {
        const suppliers = await Supplier.find().sort({ tradeName: 1 });

        return {code: 200, message: 'Suppliers', success: true, data: suppliers};
    } catch (error) {
        throw error;
    }
};

export const getSupplierService = async (supplierId) => {
    try {
        const supplier = await Supplier.findById(supplierId);

        if(!supplier){
            return {code: 404, message: 'Supplier not found', success: false, data: []};
        }

        return {code: 200, message: 'Supplier', success: true, data: supplier};
    } catch (error) {
        throw error;
    }
};

export const createSuppliersService = async (operation) => {

};

export const updateSupplierService = async (operation, supplierId) => {

};

export const deleteSupplierService = async (supplierId) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            supplierId, 
            { active: false },
            { returnDocument: 'after' }
        );

        if(!supplier){
            return {code: 404, message: 'Supplier not found', success: false, data: []};
        }

        const data = {
            name: supplier.name,
            tradeName: supplier.tradeName,
            code: supplier.code
        };

        return {code: 200, message: 'Supplier deleted successfully', success: true, data};

    } catch (error) {
        throw error;
    }
};