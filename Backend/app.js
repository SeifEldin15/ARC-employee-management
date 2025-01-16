import express from 'express';
import cron from 'node-cron';
import connectDB from './config/db.js';
import Workweek from './models/workweek.js';

import authRoutes from './routes/authRoutes.js';

import employeeRoutes from './routes/employeeRoutes.js';

import companyRoutes from './routes/companyRoutes.js';

import workweekRoutes from './routes/workweekRoutes.js';

import managerRoutes from './routes/managerRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();

connectDB();

// Set up CORS before other middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://arc-employee-management-fl3e.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/manager',  managerRoutes);
app.use('/api/company', companyRoutes);


app.use('/api/workweek', workweekRoutes);
app.use('/api/reminder', reminderRoutes);


cron.schedule('0 0 * * 1', async () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    const weekNumber = Math.ceil(dayOfYear / 7);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday

    const newWorkweek = new Workweek({
        weekNumber,
        year: today.getFullYear(),
        startDate: weekStart,
        endDate: weekEnd
    });

    await newWorkweek.save();
    console.log(`New Workweek Created: Week ${weekNumber}`);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));