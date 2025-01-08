import CSR from '../models/csr.js';
import Workweek from '../models/workweek.js';

export const submitCSR = async (req, res) => {
    try {
        const { employeeId, companyName, jobType, taskDetails, travelHours, workHours, totalCost } = req.body;

        // Fetch Current Workweek
        const today = new Date();
        const currentWeek = await Workweek.findOne({ startDate: { $lte: today }, endDate: { $gte: today } });

        if (!currentWeek) return res.status(400).json({ error: 'No active workweek found.' });

        const csr = new CSR({
            employeeId,
            workWeek: currentWeek.weekNumber,
            year: currentWeek.year,
            companyName,
            jobType,
            taskDetails,
            travelHours,
            workHours,
            totalCost
        });

        await csr.save();

        res.status(200).json({ message: 'CSR submitted successfully!', csr });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting CSR' });
    }
};
