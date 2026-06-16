import mongoose from "mongoose";

const stockMovementSchema = mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            index: true
        },

        type: {
            type: String,
            enum: ['IN', 'OUT', 'ADJUSTMENT'],
            required: true,
            index: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        balanceAfter: {
            type: Number,
            required: true
        },

        reason: {
            type: String,
            trim: true,
            maxLength: 255
        },

        referenceType: {
            type: String,
            enum: ['PURCHASE', 'SALE', 'MANUAL', 'RETURN', 'SYSTEM'],
            default: 'MANUAL',
            index: true
        },
         referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
         },

         unitCost: {
            type: Number,
            min: 0
         },

         createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
         },

         metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
         }
    }, { timestamps: true }
);

stockMovementSchema.index({ product: 1, createdAt: -1 });
stockMovementSchema.index({ referenceType: 1, referenceId: 1 });

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

export default StockMovement;