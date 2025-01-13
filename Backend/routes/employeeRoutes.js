import express from 'express';
import { submitUtilization , submitCSR , getEmployeeReports , getPastVisitForCompany} from '../controllers/ReportsController.js'
import  authMiddleware  from '../middleware/authMiddleware.js';



const router = express.Router();

router.post('/utilization',authMiddleware, submitUtilization);
router.post('/csr',authMiddleware, submitCSR);
router.get('/reports', authMiddleware ,getEmployeeReports);
router.get('/:companyId/past-visits', authMiddleware, getPastVisitForCompany);

export default router;
