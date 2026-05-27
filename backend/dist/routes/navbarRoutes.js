"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const navbarController_1 = require("../controllers/navbarController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', navbarController_1.getNavbarLinks);
// Admin only routes
router.post('/', authMiddleware_1.protect, navbarController_1.createNavbarLink);
router.put('/:id', authMiddleware_1.protect, navbarController_1.updateNavbarLink);
router.delete('/:id', authMiddleware_1.protect, navbarController_1.deleteNavbarLink);
exports.default = router;
