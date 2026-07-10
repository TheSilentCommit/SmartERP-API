import {
    getSupplierService,
    getSuppliersService,
    createSuppliersService,
    updateSupplierService,
    deleteSupplierService
} from '../services/supplier.services.js';
import { sendMessage } from '../utils/responses.utils.js';

export const getSuppliersController = async (req, res, next) => {
    try {
        const result = await getSuppliersService();

        return sendMessage(res, result.code, result.message, result.success, result.data);
    } catch (error) {
        next(error);
    }
};

export const getSupplierController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await getSupplierService(id);

        return sendMessage(res, result.code, result.message, result.success, result.data);
    } catch (error) {
        next(error);
    }
};

export const createSuppliersController = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
};

export const updateSupplierController = async (req, res, next) => {

};

export const deleteSupplierController = async (req, res, next) => {

};