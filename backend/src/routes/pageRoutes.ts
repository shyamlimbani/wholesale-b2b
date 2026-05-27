import express from 'express';
import {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} from '../controllers/pageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getPages);
router.get('/:slug', getPageBySlug);

// Admin only routes
router.post('/', protect, createPage);
router.put('/:id', protect, updatePage);
router.delete('/:id', protect, deletePage);

export default router;
