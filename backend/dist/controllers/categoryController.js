"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const cloudinaryUpload_1 = require("../utils/cloudinaryUpload");
exports.getCategories = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find({}).populate('parent');
    res.json(categories);
}));
exports.getCategoryById = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findById(req.params.id).populate('parent');
    if (category) {
        res.json(category);
    }
    else {
        res.status(404);
        throw new Error('Category not found');
    }
}));
exports.createCategory = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, slug, description, parent } = req.body;
    const categoryExists = yield Category_1.default.findOne({ slug });
    if (categoryExists) {
        res.status(400);
        throw new Error('Category with this slug already exists');
    }
    let imageUrl = '';
    if (req.file) {
        imageUrl = yield (0, cloudinaryUpload_1.uploadToCloudinary)(req.file.buffer, 'categories');
    }
    const category = new Category_1.default({
        name,
        slug,
        description,
        parent: parent || null,
        image: imageUrl,
    });
    const createdCategory = yield category.save();
    res.status(201).json(createdCategory);
}));
exports.updateCategory = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, slug, description, parent } = req.body;
    const category = yield Category_1.default.findById(req.params.id);
    if (category) {
        category.name = name || category.name;
        category.slug = slug || category.slug;
        category.description = description || category.description;
        category.parent = parent || category.parent;
        if (req.file) {
            category.image = yield (0, cloudinaryUpload_1.uploadToCloudinary)(req.file.buffer, 'categories');
        }
        const updatedCategory = yield category.save();
        res.json(updatedCategory);
    }
    else {
        res.status(404);
        throw new Error('Category not found');
    }
}));
exports.deleteCategory = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findById(req.params.id);
    if (category) {
        yield Category_1.default.deleteOne({ _id: category._id });
        res.json({ message: 'Category removed' });
    }
    else {
        res.status(404);
        throw new Error('Category not found');
    }
}));
