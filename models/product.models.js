import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'The product name is required'],
            trim: true,
            minLength: [1, 'The product name must be at least 1 character long'],
            maxLength: [100, 'The product name cannot exceed 100 characters']
        },

        description: {
            type: String,
            required: [true, 'The product description is required'],
            trim: true,
            minLength: [1, 'The product description must be at least 1 character long'],
            maxLength: [100, 'The product description cannot exceed 100 characters']
        },

        sku: {
            type: String,
            required: [true, 'The SKU code is required'],
            unique: true,
            uppercase: true,
            trim: true
        },

        barcode: {
            type: String,
            sparse: true,
            trim: true
        },

        category: {
            type: String,
            required: [true, 'The category is required'],
            trim: true,
            minLength: [1, 'The product category must be at least 1 character long'],
            maxLength: [100, 'The product category cannot exceed 100 characters']
        },

        costPrice: {
            type: Number,
            required: [true, 'The cost price is required'],
            min: [0, 'The cost price cannot be negative']
        },

        salePrice: {
            type: Number,
            required: [true, 'The sele price is required'],
            min: [0, 'The sale price cannot be negative']
        },

        unit: {
            type: String,
            required: true,
            enum: ['UN', 'KG', 'G', 'L', 'ML']
        },

        active: {
            type: Boolean,
            default: true
        },
    }, 
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;