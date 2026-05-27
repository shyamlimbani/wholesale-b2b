"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pageController_1 = require("../controllers/pageController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', pageController_1.getPages);
router.get('/:slug', pageController_1.getPageBySlug);
// Admin only routes
router.post('/', authMiddleware_1.protect, pageController_1.createPage);
router.put('/:id', authMiddleware_1.protect, pageController_1.updatePage);
router.delete('/:id', authMiddleware_1.protect, pageController_1.deletePage);
exports.default = router;
