import mongoose from "mongoose";

const utilizationSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    WeekNumber: Number,
    year: Number,
    SVR_Category: [{
        SVR: String,
        day: String
    }],
    tasks: [{
        category: String,
        hours: Number,
        day: String
    }],
    totalHours: Number,
    pdfPath: String
});

// Prevent model recompilation in development
const Utilization = mongoose.models.Utilization || mongoose.model('Utilization', utilizationSchema);
export default Utilization;
