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
        
    },
    
    
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;