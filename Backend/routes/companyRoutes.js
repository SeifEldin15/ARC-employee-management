import express from 'express';
import { createCompany, deleteCompany ,  addContact, deleteContact, addTool, deleteTool, getCompanies, getCompanyDetails, getContacts, getTools, getPastVisitForCompany } from '../controllers/companyController.js';
import  authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware ,getCompanies);
router.get('/:companyId/past-visits', authMiddleware, getPastVisitForCompany);
router.get('/:companyId', authMiddleware , getCompanyDetails);
router.get('/:companyId/contacts', authMiddleware, getContacts);
router.get('/:companyId/tools',authMiddleware, getTools);

router.post('/',authMiddleware ,  createCompany);
router.post('/:companyId/addTool', authMiddleware, addTool);
router.post('/:companyId/addContact', authMiddleware , addContact);

router.delete('/delete/:companyId', authMiddleware , deleteCompany);
router.delete('/:companyId/deleteContact/:contactId', authMiddleware , deleteContact);
router.delete('/:companyId/deleteTool/:toolId', authMiddleware , deleteTool);



export default router; 

