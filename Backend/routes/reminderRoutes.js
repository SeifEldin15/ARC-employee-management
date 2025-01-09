import express from 'express';
import { sendReminderEmail } from '../utils/emailService.js';

const router = express.Router();

router.post('/send-reminder', async (req, res) => {
    const { email, missingWeeks } = req.body;
    try {
        await sendReminderEmail(email, missingWeeks);
        res.status(200).json({ message: 'Reminder sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending reminder', error: error.message });
    }
});

export default router; 