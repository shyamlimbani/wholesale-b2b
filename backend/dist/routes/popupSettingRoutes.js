"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const popupSettingController_1 = require("../controllers/popupSettingController");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
router.route('/')
    .get(popupSettingController_1.getPopupSettings)
    .put(uploadMiddleware_1.default.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]), popupSettingController_1.updatePopupSettings);
exports.default = router;
