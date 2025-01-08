import express from 'express';
import { createContact, deleteContact } from '../Backend/controllers/contactController.js';

const router = express.Router();

router.post('/', createContact);
router.delete('/:id', deleteContact);

export default router; 