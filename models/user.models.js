import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'User e-mail is required'],
        trim: true,
        lowercase: true,
        unique: true,
        minLength: 7,
        maxLength: 255,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid e-mail address'],
    },
    password: { 
        type: String,
        required: [true, 'User password is required'],
        minLength: 6,
        select: false,
    },
    admin: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;