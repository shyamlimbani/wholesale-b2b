"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const seedPages_1 = require("./utils/seedPages");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Connect to MongoDB
(0, db_1.default)().then(() => {
    (0, seedPages_1.seedPages)();
});
// Basic Route
app.get('/', (req, res) => {
    res.send('Wholesale B2B API is running...');
});
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const pageRoutes_1 = __importDefault(require("./routes/pageRoutes"));
const navbarRoutes_1 = __importDefault(require("./routes/navbarRoutes"));
const catalogRoutes_1 = __importDefault(require("./routes/catalogRoutes"));
const footerMenuRoutes_1 = __importDefault(require("./routes/footerMenuRoutes"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const popupSettingRoutes_1 = __importDefault(require("./routes/popupSettingRoutes"));
// Use Routes
app.use('/api/admin', authRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/banners', bannerRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
app.use('/api/pages', pageRoutes_1.default);
app.use('/api/navbar', navbarRoutes_1.default);
app.use('/api/catalog', catalogRoutes_1.default);
app.use('/api/footer-menus', footerMenuRoutes_1.default);
app.use('/api/leads', leadRoutes_1.default);
app.use('/api/popup-settings', popupSettingRoutes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
