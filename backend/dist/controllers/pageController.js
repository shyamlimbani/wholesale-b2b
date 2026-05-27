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
exports.deletePage = exports.updatePage = exports.createPage = exports.getPageBySlug = exports.getPages = void 0;
const Page_1 = __importDefault(require("../models/Page"));
const getPages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {};
        if (req.query.active === 'true') {
            query.isActive = true;
        }
        const pages = yield Page_1.default.find(query).sort({ createdAt: -1 });
        res.json(pages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching pages' });
    }
});
exports.getPages = getPages;
const getPageBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = yield Page_1.default.findOne({ slug: req.params.slug, isActive: true });
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.json(page);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching page' });
    }
});
exports.getPageBySlug = getPageBySlug;
const createPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, slug, content, heroSubtitle, seoTitle, seoDescription, isActive } = req.body;
        const existing = yield Page_1.default.findOne({ slug });
        if (existing) {
            return res.status(400).json({ message: 'Page with this slug already exists' });
        }
        const newPage = new Page_1.default({ title, slug, content, heroSubtitle, seoTitle, seoDescription, isActive });
        const savedPage = yield newPage.save();
        res.status(201).json(savedPage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating page' });
    }
});
exports.createPage = createPage;
const updatePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, slug, content, heroSubtitle, seoTitle, seoDescription, isActive } = req.body;
        const page = yield Page_1.default.findById(req.params.id);
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        if (slug && slug !== page.slug) {
            const existing = yield Page_1.default.findOne({ slug });
            if (existing) {
                return res.status(400).json({ message: 'Page with this slug already exists' });
            }
        }
        page.title = title || page.title;
        page.slug = slug || page.slug;
        page.content = content !== undefined ? content : page.content;
        page.heroSubtitle = heroSubtitle !== undefined ? heroSubtitle : page.heroSubtitle;
        page.seoTitle = seoTitle !== undefined ? seoTitle : page.seoTitle;
        page.seoDescription = seoDescription !== undefined ? seoDescription : page.seoDescription;
        page.isActive = isActive !== undefined ? isActive : page.isActive;
        const updatedPage = yield page.save();
        res.json(updatedPage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating page' });
    }
});
exports.updatePage = updatePage;
const deletePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = yield Page_1.default.findByIdAndDelete(req.params.id);
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.json({ message: 'Page removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting page' });
    }
});
exports.deletePage = deletePage;
