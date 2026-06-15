import mongoose, { mongo } from "mongoose";
import Product from "../models/product.models.js";
import { sendError, sendSuccess } from "../utils/responses.utils.js";

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        return sendSuccess(res, 200, 'OK', products)
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if(!product){
            return sendError(404, 'Product not found');
        }

        return sendSuccess(res, 200, 'OK', product);
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { 
            name, description, sku, barcode, category, costPrice, salePrice, unit, active 
        } = req.body;

        const normalizedSku = sku.trim().toUpperCase();

        const existingProduct = await Product.findOne({ sku: normalizedSku });

        if(existingProduct){
            return sendError(409, 'Product already registered');
        }

        const newProduct = await Product.create([{
            name, description, sku: normalizedSku, barcode, category, costPrice, salePrice, unit, active
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return sendSuccess(res, 201, 'Product created successfully', newProduct[0]);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const allowedFields = [
            'name', 'description', 'sku', 'barcode', 'category', 'costPrice', 'salePrice', 'unit', 'active'
        ];

        const updateData = {};

        for(const field of allowedFields){
            if(req.body[field] !== undefined){
                updateData[field] = req.body[field];
            }
        }

        if(Object.keys(updateData).length === 0){
            return sendError(400, 'No valid field for update provided');
        }

        const product = await Product.findByIdAndUpdate(id, updateData, {returnDocument: 'after', runValidators: true});

        if(!product){
            return sendError(404, 'Product not found');
        }

        return sendSuccess(res, 200, 'Product updated successfully', product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = Product.findByIdAndDelete(id);

        if(!product){
            return sendError(404, 'Product not found');
        }

        const data = {
            name: product.name,
            sku: product.sku
        };

        return sendSuccess(res, 200, 'Product deleted successfully', data);
    } catch (error) {
        next(error);
    }
};