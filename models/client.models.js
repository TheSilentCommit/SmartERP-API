import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50
    },

    document: {
        type: String,
        required: [true, 'Client document is required'],
        trim: true,
        unique: true
    },

    documentType: {
        type: String,
        enum: ['CPF', 'CNPJ'],
        default: 'CPF'
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        minLength: 7,
        maxLength: 50,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid e-mail address']
    },

    phone: {
        type: String,
        trim: true
    },

    address: {
        street: {
            type: String,
            trim: true
        },

        number: {
            type: String,
            trim: true
        },

        complement: {
            type: String,
            trim: true
        },

        district: {
            type: String,
            trim: true
        },

        city: {
            type: String,
            trim: true
        },

        state: {
            type: String,
            trim: true
        },

        zipCode: {
            type: String,
            trim: true
        },

        country: {
            type: String,
            trim: true,
            default: 'Brazil'
        }
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    active: {
        type: Boolean,
        default: true
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
    
}, { timestamps: true });

clientSchema.index({ name: 1 });
clientSchema.index({ active: 1 });

const Client = mongoose.model('Client', clientSchema);

export default Client;