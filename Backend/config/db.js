import mongoose from 'mongoose';
import { MONGO_URI } from '../env.js';

const connectDB = async () => {
    try {
        console.log('Attempting to connect with URI:', MONGO_URI);
        const conn = await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;
