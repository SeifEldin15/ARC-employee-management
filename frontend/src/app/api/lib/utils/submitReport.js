import Workweek from '../models/workweek.js';


export const submitReport = async (weekNumber, employeeId, reportType, pdfPath) => {
    let workweek = await Workweek.findOne({ weekNumber });

    if (!workweek) {
        workweek = new Workweek({ weekNumber, pendingReports: [] });
    }

    let employeeReport = workweek.pendingReports.find(report => report.employeeId.equals(employeeId));

    if (!employeeReport) {
        employeeReport = { 
            employeeId, 
            reportTypes: [{
                type: reportType,
                pdfPath,
                submittedAt: new Date()
            }]
        };
        workweek.pendingReports.push(employeeReport);
    } else {
        const reportExists = employeeReport.reportTypes.some(rt => rt.type === reportType);

        if (reportExists) {
            console.log(`Report of type ${reportType} already exists for employee ${employeeId} in work week ${weekNumber}`);
            return;
        }

        const newReport = {
            type: reportType,
            pdfPath,
            submittedAt: new Date()
        };

        employeeReport.reportTypes.push(newReport);
    }

    await workweek.save();
};

