import express from 'express';
import {
  getNavbarLinks,
  createNavbarLink,
  updateNavbarLink,
  deleteNavbarLink,
} from '../controllers/navbarController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getNavbarLinks);

// Admin only routes
router.post('/', protect, createNavbarLink);
router.put('/:id', protect, updateNavbarLink);
router.delete('/:id', protect, deleteNavbarLink);

export default router;
