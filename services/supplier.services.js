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

export const createSuppliersService = async (operations, userId) => {

    if(!Array.isArray(operations)){
        return {code: 400, message: 'Operations must be an array', success: false, data: []};
    }

    const session = await mongoose.startSession()
    session.startTransaction();

    const suppliers = [];

    try {
        const documents = operations.map(op => op.document);

        const existingSupplier = await Supplier.find({ document: { $in: documents } });

        if(existingSupplier.length > 0){
            await session.abortTransaction();

            return {code: 400, message: 'One or more suppliers are already registered', success: false, 
                data: existingSupplier.map(s => ({
                    name: s.name,
                    tradeName: s.tradeName,
                    document: s.document
                }))
            };
        }

        const duplicatedSupplier = documents.filter((doc, index) => documents.indexOf(doc) !== index);

        if(duplicatedSupplier.length > 0){
            await session.abortTransaction();

            return {code: 400, message: 'Duplicate documents found in the request', success: false, 
                data: [...new Set(duplicatedSupplier)]
            };
        }

        for(const operation of operations){
            const {
                name,
                tradeName,
                document,
                documentType = 'CNPJ',
                code,
                email,
                mainPhone,
                secondaryPhone = null,
                website = null,
                contactPerson = null,
                address: {
                    street = null,
                    number = null,
                    complement = null,
                    district = null,
                    city = null,
                    state = null,
                    zipCode = null,
                    country = null
                } = {}
            } = operation;

            suppliers.push({
                name,
                tradeName,
                document,
                documentType,
                code,
                email,
                mainPhone,
                secondaryPhone,
                website,
                contactPerson,
                address: {
                    street,
                    number,
                    complement,
                    district,
                    city,
                    state,
                    zipCode,
                    country
                },
                createdBy: userId,
                active: true
            });
            
        }

        const createdSuppliers = await Supplier.insertMany(suppliers, { session });

        await session.commitTransaction();

        return {code: 201, message: 'Suppliers registered successfully', success: true, data: createdSuppliers};

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
    
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