import mongoose from "mongoose";

const utilizationSchema = new mongoose.Schema({
    employeeId: String,
    workWeek: Number,
    year: Number,
    tasks: [
        {
            category: String,
            hours: Number,
            day: String
        }
    ],
    totalHours: Number
});

export default mongoose.model('Utilization', utilizationSchema);
