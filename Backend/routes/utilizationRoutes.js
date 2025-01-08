import express from 'express'
import { submitUtilizationReport } from '../controllers/utilizationController.js'

const router = express.Router();

router.post('/submit', submitUtilizationReport);

export default router;
