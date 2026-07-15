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

    if(operations.length === 0){
        return {code: 400, message: 'Operations array cannot be empty', success: false, data: []};
    }

    const suppliers = [];

    const documents = operations.map(op => op.document);

    const duplicatedDocuments = documents.filter((doc, index) => documents.indexOf(doc) !== index);

    if(duplicatedDocuments.length > 0){
        return {code: 400, message: 'Duplicate documents found in the request', success: false, 
            data: [...new Set(duplicatedSupplier)]
        };
    }

    const existingSuppliers = await Supplier.find({ document: { $in: documents } });

    if(existingSuppliers.length > 0){
        return {code: 400, message: 'One or more suppliers are already registered', success: false, 
            data: existingSupplier.map(s => ({
                name: s.name,
                tradeName: s.tradeName,
                document: s.document
            }))
        };
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction();

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

export const updateSupplierService = async (data, supplierId, userId) => {

    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();

        const updateData = {};

        const allowedFields = [
            'name',
            'tradeName',
            'document',
            'documentType',
            'code',
            'email',
            'mainPhone',
            'secondaryPhone',
            'website',
            'contactPerson'
        ];

        for (const field of allowedFields) {
            
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        }

        if (data.address) {
            for (const [key, value] of Object.entries(data.address)) {
                updateData[`address.${key}`] = value;
            }
        }

        updateData.updatedBy = userId;

        const supplier = await Supplier.findByIdAndUpdate(
            supplierId,
            { $set: updateData },
            {
                returnDocument: 'after',
                runValidators: true,
                session
            }
        );

        if(!supplier){
            await session.abortTransaction();

            return {code: 404, message: 'Supplier not found', success: false, data: []};
        }

        await session.commitTransaction();

        return {code: 200, message: 'Supplier updated successfully', success: true, data: supplier};
        
    } catch (error) {
        await session.abortTransaction();

        error.message = `[updateSupplierService] ${error.message}`;
        throw error;
    } finally {
        session.endSession();
    }
};

export const deleteSupplierService = async (supplierId, userId) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            supplierId, 
            { 
                active: false,
                updatedBy: userId
            },
            { returnDocument: 'after' }
        ).populate('updatedBy', 'name');

        if(!supplier){
            return {code: 404, message: 'Supplier not found', success: false, data: []};
        }

        const data = {
            name: supplier.name,
            tradeName: supplier.tradeName,
            code: supplier.code,
            updatedBy: supplier.updatedBy?.name
        };

        return {code: 200, message: 'Supplier deleted successfully', success: true, data};

    } catch (error) {
        throw error;
    }
};