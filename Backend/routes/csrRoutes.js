import express from 'express';
import { submitCSR } from '../controllers/csrController.js';

const router = express.Router();

router.post('/submit', submitCSR);

export default router;
