import User from '../models/User.js' ;
import jwt from 'jsonwebtoken' ;
import {JWT_SECRET , NODE_ENV } from '../config/env.js'
import bcrypt from 'bcrypt' ;

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        
        res.cookie('token', token, { httpOnly: true, secure: NODE_ENV === 'production' });
        
        const redirectUrl = user.role === 'Manager' ? '/manager/dashboard' : '/employee/dashboard';
        res.redirect(redirectUrl);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


