import express from 'express';
import { submitUtilization , submitCSR , getEmployeeReports } from '../controllers/ReportsController.js'



const router = express.Router();

router.post('/utilization', submitUtilization);
router.post('/csr', submitCSR);
router.get('/reports', getEmployeeReports);

export default router;
