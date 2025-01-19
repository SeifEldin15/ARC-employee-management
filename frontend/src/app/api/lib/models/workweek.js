import mongoose from 'mongoose' ;

const workweekSchema = new mongoose.Schema({
    weekNumber: Number,
    year: Number,
    startDate: Date,
    endDate: Date,
    created: { type: Date, default: Date.now },
    pendingReports: [{
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reportTypes: [{
            type: { type: String, enum: ['Utilization', 'CSR'] },
            pdfPath: String ,
            submittedAt: Date
        }]
    }]
 
});

// Prevent model recompilation in development
const Workweek = mongoose.models.Workweek || mongoose.model('Workweek', workweekSchema);

export default Workweek;
