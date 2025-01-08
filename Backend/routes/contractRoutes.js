import express from 'express';
import { createContract, deleteContract } from '../Backend/controllers/contractController.js';

const router = express.Router();

router.post('/', createContract);
router.delete('/:id', deleteContract);

export default router; 