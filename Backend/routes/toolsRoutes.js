import express from 'express';
import { createTool, deleteTool } from '../Backend/controllers/toolsController.js';

const router = express.Router();

router.post('/', createTool);
router.delete('/:id', deleteTool);

export default router; 