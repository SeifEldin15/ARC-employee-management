import User from '../../models/User.js' ;
import jwt from 'jsonwebtoken' ;
import {JWT_SECRET , NODE_ENV } from '../config/env.js'
import bcrypt from 'bcrypt' ;


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the hashed password with the provided password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        
        // Set cookie with the token
        res.cookie('token', token, { httpOnly: true, secure: NODE_ENV === 'production' });
        
        // Redirect based on role
        if (user.role === 'Manager') {
            return res.redirect('/manager/dashboard'); 
        } else {
            return res.redirect('/employee/dashboard');
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const registerEmployee = async (req, res) => {
     
    const { name, password, Region, role, job_title, email, phone, manager_id } = req.body;
    if (role !== 'Employee') {
        return res.status(400).json({ message: 'Role must be Employee' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            password: hashedPassword,
            Region,
            role :"Employee",
            job_title,
            email,
            phone,
            manager_id 
        });
        res.status(201).json({ message: 'Employee registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering employee', error: error.message });
    }
};

export { login, registerEmployee };

