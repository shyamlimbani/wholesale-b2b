import express from 'express';
import { downloadCatalog } from '../controllers/catalogController';

const router = express.Router();

router.get('/download/:categoryId', downloadCatalog);

export default router;
