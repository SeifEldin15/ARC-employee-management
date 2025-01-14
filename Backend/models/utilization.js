import mongoose from "mongoose";

const utilizationSchema = new mongoose.Schema({
    employeeId: String,
    WeekNumber: Number ,
    year: Number,
    SVR_Category : [
        {
            SVR: String ,
            day: String
        }
    ],
    tasks: [
        {
            category: String,
            hours: Number,
            day: String
        }
    ],
    totalHours: Number ,
    pdfPath: String 

});

export default mongoose.model('Utilization', utilizationSchema);
