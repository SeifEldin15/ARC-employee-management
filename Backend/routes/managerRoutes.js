import express from 'express';
import { getManagerDashboard } from '../controllers/MDes_Controller.js';
import { getManagerTeam , addManagerTeamMember , deleteManagerTeamMember} from '../controllers/teamController.js';
import { createContract, deleteContract , getContracts } from '../controllers/contractController.js';


const router = express.Router();

router.get('/dashboard', getManagerDashboard);

router.get('/contracts', getContracts);
router.post('/contracts', createContract);
router.delete('/contracts/:id', deleteContract);

router.get('/team', getManagerTeam);
router.post('/team', addManagerTeamMember);
router.delete('/team/:employeeId', deleteManagerTeamMember);


export default router; 