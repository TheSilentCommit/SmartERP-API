import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Supplier name is required'],
        trim: true,
        minLength: 1,
        maxLength: 150
    },

    tradeName: {
        type: String,
        required: [true, 'Supplier trade name is required'],
        trim: true,
        minLength: 1,
        maxLength: 150
    },

    document: {
        type: String,
        required: [true, 'Supplier document is required'],
        trim: true,
        unique: true,
    },

    documentType: {
        type: String,
        required: [true, 'Supplier document type is required'],
        enum: ['CPF', 'CNPJ'],
        default: 'CNPJ'
    },

    code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        unique: true
    },

    email: {
        type: String,
        required: [true, 'Supplier e-mail is required'],
        trim: true,
        unique: true,
        lowercase: true,
        minLength: 7,
        maxLength: 50,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid e-mail address']
    },

    mainPhone: {
        type: String,
        required: [true, 'Supplier phone is required'],
        trim: true,
    },

    secondaryPhone: {
        type: String,
        trim: true,
    },

    website: {
        type: String,
        trim: true,
        lowercase: true
    },

    contactPerson: {
        type: String,
        trim: true,
        maxLength: 100
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

    active: {
        type: Boolean,
        default: true,
        index: true
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, { timestamps: true });

supplierSchema.index({ name: 1 });
supplierSchema.index({ tradeName: 1 });
supplierSchema.index({ active: 1 });

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;