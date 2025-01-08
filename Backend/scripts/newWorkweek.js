import Workweek from '../models/workweek.js'; 
import connectDB from '../config/db.js';
connectDB();


const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 1);
const dayOfYear = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
let weekNumber = Math.ceil(dayOfYear / 7);

for (let i = 0; i < 10; i++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1 + (i * 7)); // Monday of the i-th week
    weekStart.setHours(0, 0, 0, 0); // Set time to midnight

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday of the i-th week
    weekEnd.setHours(0, 0, 0, 0); // Set time to midnight

    // Convert dates to YYYY-MM-DD format
    const formatDate = (date) => date.toISOString().split('T')[0];

    const newWorkweek = new Workweek({
        weekNumber: weekNumber + i,
        year: today.getFullYear(),
        startDate: formatDate(weekStart),
        endDate: formatDate(weekEnd)
    });

    newWorkweek.save()
        .then(() => console.log(`New Workweek Created: Week ${weekNumber + i}`))
        .catch(err => console.error('Error creating workweek:', err));
}
