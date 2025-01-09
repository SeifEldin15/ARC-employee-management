import express from 'express';
import { getManagerDashboard } from '../controllers/managerController.js';

const router = express.Router();

router.get('/dashboard', getManagerDashboard);

export default router; 