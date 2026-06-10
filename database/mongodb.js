import mongoose from "mongoose";

import { NODE_ENV, DB_URI } from "../config/env.js";

if(!DB_URI){
    throw new Error('Please define the DB_URI in .env.<production/development>.local');
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