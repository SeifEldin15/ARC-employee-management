import express from 'express' ;
import Workweek from '../models/workweek.js';

const router = express.Router();

router.get('/current', async (req, res) => {
    try {
        // const today = new Date();
        const today = new Date().setUTCHours(0, 0, 0, 0);
        
        const currentWeek = await Workweek.findOne({ startDate: { $lte: today }, endDate: { $gte: today } })
            .select("weekNumber year startDate endDate ");

        if (!currentWeek) return res.status(404).json({ error: 'No active workweek found.' });
        
        res.status(200).json(currentWeek);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching current workweek' });
    }
});

export default router;
