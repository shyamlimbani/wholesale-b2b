"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsController_1 = require("../controllers/settingsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
router.route('/')
    .get(settingsController_1.getSettings)
    .put(authMiddleware_1.protect, uploadMiddleware_1.default.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'footerLogo', maxCount: 1 },
]), settingsController_1.updateSettings);
exports.default = router;
