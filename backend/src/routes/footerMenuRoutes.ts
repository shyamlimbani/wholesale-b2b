import express from 'express';
import {
  getFooterMenus,
  createFooterMenu,
  updateFooterMenu,
  deleteFooterMenu,
  reorderFooterMenus,
} from '../controllers/footerMenuController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getFooterMenus);

// Admin only routes
router.post('/', protect, createFooterMenu);
router.put('/reorder', protect, reorderFooterMenus);
router.put('/:id', protect, updateFooterMenu);
router.delete('/:id', protect, deleteFooterMenu);

export default router;
