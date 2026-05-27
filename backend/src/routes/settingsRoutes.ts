import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(
    protect,
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'footerLogo', maxCount: 1 },
    ]),
    updateSettings
  );

export default router;
