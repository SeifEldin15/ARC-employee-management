import mongoose from 'mongoose';

const weeklyTaskSchema = new mongoose.Schema({
    day : {type : String },
    date: { type: Date, required: true },
    travelHours: { type: Number, default: 0 },
    regularHours: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    holidayHours: { type: Number, default: 0 },
    totalHours: { 
        type: Number, 
        default: function() {
        return this.travelHours + this.regularHours + this.overtimeHours + this.holidayHours;
        } 
    },

    hourlyRate: { type: Number, default: 0 },
    totalUSD: { 
        type: Number, 
        default: function() {
        return this.totalHours * this.hourlyRate;
        } 
    },

});

const csrSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  spvNumber: { type: String, required: true },
  serviceEngineer: { type: String, required: true },
  workWeek: { type: Number, required: true },
  weekEndDate: { type: Date, required: true },
  customer: { type: String, required: true },
  address: { type: String },
  contact: { type: String },
  email: { type: String },
  tel: { type: String },
  toolpNumber: { type: String },
  jobType: { type: String },
  systemType: { type: String },
  jiraTicketNumber: { type: String },

    weeklyTaskReport: {
        type: [weeklyTaskSchema],
        validate: {
        validator: (v) => Array.isArray(v) && v.length === 7, // Ensure exactly 7 days of reports
        message: "weeklyTaskReport must contain exactly 7 days of data.",
            },
        },
    totals: {
        totalWeekHours: {
        type: Number,
        default: function() {
            return this.weeklyTaskReport.reduce((sum, day) => sum + day.totalHours, 0);
        },
        },
        totalWeekUSD: {
        type: Number,
        default: function() {
            return this.weeklyTaskReport.reduce((sum, day) => sum + day.totalUSD, 0);
        },
     },
    },
  purposeOfVisit: { type: String },
  solution: { type: String },
  recommendations: { type: String },
  additionalNotes: { type: String },
  returnVisitRequired: { type: Boolean, default: false },
  pdfPath: String,
});

export default mongoose.model('CSR', csrSchema);
