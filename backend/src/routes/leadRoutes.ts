import express from 'express';
import { createLead, getLeads, deleteLead } from '../controllers/leadController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', createLead);
router.get('/', getLeads);
router.delete('/:id', protect, deleteLead);

export default router;
