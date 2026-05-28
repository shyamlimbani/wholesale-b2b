"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
router.route('/')
    .get(categoryController_1.getCategories)
    .post(uploadMiddleware_1.default.single('image'), categoryController_1.createCategory);
router.route('/:id')
    .get(categoryController_1.getCategoryById)
    .put(uploadMiddleware_1.default.single('image'), categoryController_1.updateCategory)
    .delete(categoryController_1.deleteCategory);
exports.default = router;
