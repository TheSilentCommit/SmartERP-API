import mongoose, { mongo } from "mongoose";
import Product from "../models/product.models.js";
import { sendMessage } from "../utils/responses.utils.js";

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        return sendMessage(res, 200, 'OK', true, products)
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if(!product){
            return sendMessage(res, 404, 'Product not found', false);
        }

        return sendMessage(res, 200, 'OK', true, product);
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const products = req.body;

        const normalizedProducts = products.map(product => ({ 
            ...product, sku: product.sku.trim().toUpperCase()
        }));

        const skus = normalizedProducts.map(product => product.sku);

        const existingProducts = await Product.find({ sku: { $in: skus } });

        if(existingProducts.length > 0){
            return sendMessage(res, 409, 'Product already registered', false, 
                existingProducts.map(product => ({
                    name: product.name,
                    sku: product.sku
                }))
            );
        }

        const newProducts = await Product.insertMany(normalizedProducts, { session });

        await session.commitTransaction();
        session.endSession();

        return sendMessage(res, 201, 'Product created successfully', true, newProducts);
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
            return sendMessage(res, 400, 'No valid field for update provided', false);
        }

        const product = await Product.findByIdAndUpdate(id, updateData, {returnDocument: 'after', runValidators: true});

        if(!product){
            return sendMessage(res, 404, 'Product not found', false);
        }

        return sendMessage(res, 200, 'Product updated successfully', true, product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = Product.findByIdAndDelete(id);

        if(!product){
            return sendMessage(res, 404, 'Product not found', false);
        }

        const data = {
            name: product.name,
            sku: product.sku
        };

        return sendMessage(res, 200, 'Product deleted successfully', true, data);
    } catch (error) {
        next(error);
    }
};