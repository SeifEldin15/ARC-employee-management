import mongoose from 'mongoose';

const csrSchema = new mongoose.Schema({
    employeeId: String,
    workWeek: Number,
    year: Number,
    companyName: String,
    jobType: String,
    taskDetails: String,
    travelHours: Number,
    workHours: Number,
    totalCost: Number,
    pdfPath: String
});

export default mongoose.model('CSR', csrSchema);
