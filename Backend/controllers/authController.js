import User from '../models/User.js' ;
import jwt from 'jsonwebtoken' ;
import {JWT_SECRET , NODE_ENV } from '../config/env.js'
import bcrypt from 'bcrypt' ;

export const login = async (req, res) => {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;
    
    // Add validation for required fields
    if (!email || !password) {
        console.log('Missing required fields:', { email: !!email, password: !!password });
        return res.status(400).json({ 
            message: 'Email and password are required',
            details: { email: !email, password: !password }
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Login attempt failed: No user found for email ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ _id: user._id , role: user.role }, JWT_SECRET, { expiresIn: '3h' });
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/', 
        });        

        res.status(200).json({ 
            "token": token ,
            "role": user.role 
          })
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logout = (req, res) => {
    try {
       res.clearCookie('token', {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
        });
        // Send a success message
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during logout', error: error.message });
    }
};


