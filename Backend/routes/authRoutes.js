import express from 'express' ;
import {login, logout , changePassword} from '../controllers/authController.js' ;
import  authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/change-password', authMiddleware, changePassword);


export default router;
