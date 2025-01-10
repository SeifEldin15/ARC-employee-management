import express from 'express';
import { submitCSR } from '../controllers/csrController.js';
import { submitUtilizationReport } from '../controllers/utilizationController.js'

const router = express.Router();

router.post('/csr', submitCSR);
router.post('/utilization', submitUtilizationReport);
export default router;
