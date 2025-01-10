import express from 'express';
import { createCompany, deleteCompany, addContact, deleteContact, addTool, deleteTool, getCompanies, getCompanyDetails, getContacts, getTools } from '../controllers/companyController.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/:companyId/contacts', getContacts);
router.get('/:companyId/tools', getTools);
router.get('/:companyId', getCompanyDetails);

router.post('/addCompany', createCompany);
router.post('/:companyId/addTool', addTool);
router.post('/:companyId/addContact', addContact);

router.delete('/delete/:companyId', deleteCompany);
router.delete('/:companyId/deleteContact/:contactId', deleteContact);
router.delete('/:companyId/deleteTool/:toolId', deleteTool);

export default router; 

