import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/connectDB.js';

import authRoutes from './routes/auth.routes.js'

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
})