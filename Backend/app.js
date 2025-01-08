import express from 'express';
import connectDB from './Backend/config/db.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import cron from 'node-cron';
import Workweek from './models/workweek.js'
import workweekRoutes from './routes/workweekRoutes' ;


const app = express();
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/workweek', workweekRoutes);




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