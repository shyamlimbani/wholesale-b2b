import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { seedPages } from './utils/seedPages';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().then(() => {
  seedPages();
});

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Wholesale B2B API is running...');
});

// Import Routes
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import bannerRoutes from './routes/bannerRoutes';
import settingsRoutes from './routes/settingsRoutes';
import pageRoutes from './routes/pageRoutes';
import navbarRoutes from './routes/navbarRoutes';
import catalogRoutes from './routes/catalogRoutes';
import footerMenuRoutes from './routes/footerMenuRoutes';
import leadRoutes from './routes/leadRoutes';
import popupSettingRoutes from './routes/popupSettingRoutes';

// Use Routes
app.use('/api/admin', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/navbar', navbarRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/footer-menus', footerMenuRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/popup-settings', popupSettingRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
