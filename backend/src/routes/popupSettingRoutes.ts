import express from 'express';
import { getPopupSettings, updatePopupSettings } from '../controllers/popupSettingController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(getPopupSettings)
  .put(
    protect,
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'backgroundImage', maxCount: 1 },
    ]),
    updatePopupSettings
  );

export default router;
