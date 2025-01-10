import express from 'express';
import { getEmployees, addEmployee, deleteEmployee } from '../controllers/teamController.js';

const router = express.Router();

router.get('/:managerId', getEmployees);
router.post('/addEmployee', addEmployee);
router.delete('/:employeeId', deleteEmployee);

export default router; 