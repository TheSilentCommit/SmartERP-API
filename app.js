import express from 'express';

import { NODE_ENV, PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import connectToDatabase from './database/mongodb.js';
import authRouter from './routes/auth.routes.js';
import { errorMiddleware } from './middlewares/error.middlewares.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

// Error Middleware
app.use(errorMiddleware);

// Homepage
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'This is an API'
    });
});

app.listen(PORT, async () => {
    console.log(`API is running as ${NODE_ENV.toUpperCase()} in port ${PORT}`);

    await connectToDatabase();
});