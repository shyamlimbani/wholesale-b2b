import express from 'express';
import multer from 'multer';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProducts,
  importProducts,
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
const uploadCsv = multer({ storage: multer.memoryStorage() });

router.route('/export').get(exportProducts);
router.route('/import').post(uploadCsv.single('file'), importProducts);

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;
