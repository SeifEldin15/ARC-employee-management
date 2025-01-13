import mongoose from 'mongoose';
import { MONGO_URI } from './env.js'

const connectDB = async () => {
    try {
        console.log(MONGO_URI)
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;
