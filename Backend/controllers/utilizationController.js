import Utilization from '../models/utilization.js';
import Workweek from '../models/workweek.js';

export const submitUtilizationReport = async (req, res) => {
    try {
        const { employeeId, tasks } = req.body;

        // Fetch Current Workweek
        const today = new Date();
        const currentWeek = await Workweek.findOne({ startDate: { $lte: today }, endDate: { $gte: today } });

        if (!currentWeek) return res.status(400).json({ error: 'No active workweek found.' });

        const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);

        const report = new Utilization({
            employeeId,
            workWeek: currentWeek.weekNumber,
            year: currentWeek.year,
            tasks,
            totalHours
        });

        await report.save();

        res.status(200).json({ message: 'Utilization report submitted successfully!', report });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting utilization report' });
    }
};
