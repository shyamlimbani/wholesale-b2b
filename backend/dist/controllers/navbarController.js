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
exports.deleteNavbarLink = exports.updateNavbarLink = exports.createNavbarLink = exports.getNavbarLinks = void 0;
const Navbar_1 = __importDefault(require("../models/Navbar"));
const getNavbarLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {};
        if (req.query.active === 'true') {
            query.isVisible = true;
        }
        const links = yield Navbar_1.default.find(query).sort({ order: 1 });
        res.json(links);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching navbar links' });
    }
});
exports.getNavbarLinks = getNavbarLinks;
const createNavbarLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, link, order, isVisible } = req.body;
        const newLink = new Navbar_1.default({ title, link, order, isVisible });
        const savedLink = yield newLink.save();
        res.status(201).json(savedLink);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating navbar link' });
    }
});
exports.createNavbarLink = createNavbarLink;
const updateNavbarLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, link, order, isVisible } = req.body;
        const navLink = yield Navbar_1.default.findById(req.params.id);
        if (!navLink) {
            return res.status(404).json({ message: 'Navbar link not found' });
        }
        navLink.title = title || navLink.title;
        navLink.link = link || navLink.link;
        navLink.order = order !== undefined ? order : navLink.order;
        navLink.isVisible = isVisible !== undefined ? isVisible : navLink.isVisible;
        const updatedLink = yield navLink.save();
        res.json(updatedLink);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating navbar link' });
    }
});
exports.updateNavbarLink = updateNavbarLink;
const deleteNavbarLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const navLink = yield Navbar_1.default.findByIdAndDelete(req.params.id);
        if (!navLink) {
            return res.status(404).json({ message: 'Navbar link not found' });
        }
        res.json({ message: 'Navbar link removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting navbar link' });
    }
});
exports.deleteNavbarLink = deleteNavbarLink;
