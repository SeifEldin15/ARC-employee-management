import mongoose from 'mongoose' ;

const workweekSchema = new mongoose.Schema({
    weekNumber: Number,
    year: Number,
    startDate: Date,
    endDate: Date,
    created: { type: Date, default: Date.now },
    pendingReports: [{ employeeId: String, type: String }] 
});

export default mongoose.model('Workweek', workweekSchema);
