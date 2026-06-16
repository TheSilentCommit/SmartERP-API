import mongoose from "mongoose";

import { NODE_ENV, DB_URI } from "../config/env.js";

if(!DB_URI){
    const error = new Error('Please define the DB_URI in .env.<production/development>.local');
    error.statusCode = 500;
    throw error;
}
 
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);

        console.log(`Connected to the database in ${NODE_ENV.toUpperCase()} mode`);
    } catch (error) {
        console.error('Error connecting to the database: ', error);
        process.exit(1);
    }
};

export default connectToDatabase;