import express from 'express';
import { getManagerDashboard } from '../controllers/MDes_Controller.js';
import { getManagerTeam , addManagerTeamMember , deleteManagerTeamMember} from '../controllers/teamController.js';
import { createContract, deleteContract , getContracts } from '../controllers/contractController.js';
import  authMiddleware  from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/dashboard', authMiddleware , getManagerDashboard);

router.get('/contracts',authMiddleware , getContracts);
router.post('/contracts', authMiddleware ,createContract);
router.delete('/contracts/:id', authMiddleware, deleteContract);

router.get('/team', authMiddleware, getManagerTeam);
router.post('/team',authMiddleware, addManagerTeamMember);
router.delete('/team/:employeeId', authMiddleware , deleteManagerTeamMember);


export default router; 