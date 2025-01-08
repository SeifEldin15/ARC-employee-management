import express from 'express' ;
import login from '../Backend/controllers/authController.js' ;

const router = express.Router();

router.post('/login', login);

export default router;
