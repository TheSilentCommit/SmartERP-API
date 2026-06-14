import mongoose, { mongo } from "mongoose";
import Product from "../models/user.models.js";
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

        const newProduct = await Product.create({
            name, description, sku: normalizedSku, barcode, category, costPrice, salePrice, unit, active
        }, { session });

        await session.commitTransaction();
        session.endSession();

        return sendSuccess(res, 201, 'Product created successfully', newProduct);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};