import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Utilization from '../models/utilization.js'
import Workweek from '../models/workweek.js'

export const getManagerTeam = async (req, res) => {
    try {
        const managerId  = req.user._id;
        const employees = await User.find({ managerId }).sort('Region');
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error in getManagerTeam:', error);
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};

export const addManagerTeamMember = async (req, res) => {
    try {
        const managerId  = req.user._id;

        const { name, password, Region, job_title, email, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newEmployee = new User({
            name,
            password: hashedPassword,
            Region,
            role: 'Employee',
            job_title,
            email,
            phone,
            managerId
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully'});
    } catch (error) {
        console.error('Error in addManagerTeamMember:', error);
        res.status(500).json({ message: 'Error adding employee', error: error.message });
    }
};

export const deleteManagerTeamMember = async (req, res) => {
    try {
        const { employeeId } = req.params;
        await User.findByIdAndDelete(employeeId);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error in deleteManagerTeamMember:', error);
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
}; 




export const getEmployeeDetails = async (req, res) => {
    try {
      const { employeeId } = req.params; 
  
      const workweeks = await Workweek.find({}).sort({ weekNumber: -1 });
  
      const utilizationData = await Utilization.find({ employeeId });
  
      if (!workweeks || workweeks.length === 0) {
        return res.status(404).json({ success: false, message: 'No workweek data found for this employee' });
      }
  
      const reportData = workweeks.map((ww) => {

        const utilizationReportPath = ww.pendingReports.find(
          (report) => report.employeeId.toString() === employeeId
        )?.reportTypes.find(reportType => reportType.type === 'Utilization');


        const utilizationReport = utilizationData.find(
          (util) => util.WeekNumber === ww.weekNumber && util.year === ww.year
        );
  
        const csrReport = ww.pendingReports.find(
          (report) => report.employeeId.toString() === employeeId
        )?.reportTypes.find(reportType => reportType.type === 'CSR');
        
     
        return {
          week: ww.weekNumber,
          dateRange: `${ww.startDate} - ${ww.endDate}`,
          sumWorkHours: utilizationReport ? utilizationReport.totalHours || 0 : 0,
          utilizationPdfPath: utilizationReportPath ? utilizationReportPath.pdfPath : null,
          csrPdfPath: csrReport ? csrReport.pdfPath : null,
        };

      });

      const totalBillableHours = utilizationData.reduce((sum, record) => sum + (record.totalHours || 0), 0);
      const averageUtilization =
        utilizationData.length > 0
          ? utilizationData.reduce((sum, record) => sum + (record.totalHours || 0), 0) / utilizationData.length: 0;

          const responseData = {
            metrics: {
              averageUtilization: parseFloat(averageUtilization.toFixed(2)), // Rounded to 2 decimal places
              totalBillableHours,
            },

            utilizationHistory: reportData,
          };
      
  
      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      console.error('Error in getEmployeeReportDetails:', error);
      res.status(500).json({ success: false, message: 'Error fetching report details', error: error.message });
    }
  };
  