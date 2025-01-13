import User from '../models/User.js';
import Utilization from '../models/utilization.js';
import Workweek from '../models/workweek.js';

export const getManagerDashboard = async (req, res) => {
    try {
        const managerId = req.user._id;

        const employees = await User.find({ managerId, role: 'Employee' }).select("name email");

        const allWeeks = await Workweek.find().select('weekNumber startDate endDate pendingReports');

        const employeeData = await Promise.all(employees.map(async (employee) => {
            const missingWeeks = allWeeks
                .filter(week => {
                    const report = week.pendingReports.find(report => report.employeeId.equals(employee._id));
                    return !report;
                })
                .map(week => ({
                    weekNumber: `WW${week.weekNumber}`,
                    dateRange: `${week.startDate.toISOString().split('T')[0]} - ${week.endDate.toISOString().split('T')[0]}`
                }));

            return {
                employee,
                missingWeeks
            };
        }));

        employeeData.sort((a, b) => b.missingWeeks.length - a.missingWeeks.length);

        res.status(200).json(employeeData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
}; 
