import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js'; // Ensure you have the User model defined
import bcrypt from 'bcrypt' 

const createUser = async () => {
    await connectDB(); // Connect to the database
    const hashedPassword = await bcrypt.hash('123', 10);

    const user = {
        name: "yousef",
        role: "Manager",
        email: "admin@gmail.com",
        manager_id: null ,
        password : hashedPassword ,
    };

    try {
        const newUser = await User.create(user);
        console.log('User created:', newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
    } finally {
        mongoose.connection.close(); // Close the connection
    }
};

createUser();
