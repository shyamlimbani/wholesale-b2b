import express from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(upload.single('image'), createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(upload.single('image'), updateCategory)
  .delete(deleteCategory);

export default router;
