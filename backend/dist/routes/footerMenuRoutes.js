"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const footerMenuController_1 = require("../controllers/footerMenuController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', footerMenuController_1.getFooterMenus);
// Admin only routes
router.post('/', authMiddleware_1.protect, footerMenuController_1.createFooterMenu);
router.put('/reorder', authMiddleware_1.protect, footerMenuController_1.reorderFooterMenus);
router.put('/:id', authMiddleware_1.protect, footerMenuController_1.updateFooterMenu);
router.delete('/:id', authMiddleware_1.protect, footerMenuController_1.deleteFooterMenu);
exports.default = router;
