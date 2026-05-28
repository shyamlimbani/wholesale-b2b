import express from 'express';
import {
  createBanner,
  deleteBanner,
  getBannerById,
  getBanners,
  updateBanner,
} from '../controllers/bannerController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(getBanners)
  .post(upload.single('image'), createBanner);

router.route('/:id')
  .get(getBannerById)
  .put(upload.single('image'), updateBanner)
  .delete(deleteBanner);

export default router;
