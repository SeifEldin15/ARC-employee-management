import express from 'express';
import { submitUtilization , submitCSR , getEmployeeReports } from '../controllers/ReportsController.js'
import  authMiddleware  from '../middleware/authMiddleware.js';



const router = express.Router();

router.post('/utilization',authMiddleware, submitUtilization);
router.post('/csr',authMiddleware, submitCSR);
router.get('/reports', authMiddleware ,getEmployeeReports);

export default router;
