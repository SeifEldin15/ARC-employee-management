import express from 'express';
import { createCompany, deleteCompany, addContact, deleteContact, addTool, deleteTool } from '../Backend/controllers/companyController.js';

const router = express.Router();

router.post('/', createCompany);
router.delete('/:companyId', deleteCompany);
router.post('/:companyId/contacts', addContact);
router.delete('/:companyId/contacts/:contactId', deleteContact);
router.post('/:companyId/tools', addTool);
router.delete('/:companyId/tools/:toolId', deleteTool);

export default router; 