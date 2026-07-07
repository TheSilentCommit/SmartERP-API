import express from 'express';

import { NODE_ENV, PORT } from './config/env.js';
import { errorMiddleware } from './middlewares/error.middlewares.js';
import { sendMessage } from './utils/responses.utils.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import stocksRouter from './routes/stock.routes.js';
import connectToDatabase from './database/mongodb.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/stocks', stocksRouter);

// Error Middleware
app.use(errorMiddleware);

// Homepage
app.get('/', (req, res) => {
    return sendMessage(res, 200, 'Welcome to SmartERP-API', true);
});
 
app.listen(PORT, async () => {
    console.log(`API is running as ${NODE_ENV.toUpperCase()} in port ${PORT}`);

    await connectToDatabase();
});