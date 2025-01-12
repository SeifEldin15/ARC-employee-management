import User from '../models/User.js';
import Utilization from '../models/utilization.js';
import Workweek from '../models/workweek.js';

export const getManagerDashboard = async (req, res) => {
    try {
        const managerId = req.user.id;
        const employees = await User.find({ manager_id: managerId, role: 'Employee' });

        const today = new Date();
        const currentWeek = await Workweek.findOne({ startDate: { $lte: today }, endDate: { $gte: today } });

        const employeeData = await Promise.all(employees.map(async (employee) => {
            const reports = await Utilization.find({ employeeId: employee._id, year: currentWeek.year });
            const missingWeeks = []; // Logic to determine missing weeks

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