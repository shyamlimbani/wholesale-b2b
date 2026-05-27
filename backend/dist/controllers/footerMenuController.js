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
exports.reorderFooterMenus = exports.deleteFooterMenu = exports.updateFooterMenu = exports.createFooterMenu = exports.getFooterMenus = void 0;
const FooterMenu_1 = __importDefault(require("../models/FooterMenu"));
const getFooterMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {};
        if (req.query.active === 'true') {
            query.isActive = true;
        }
        const links = yield FooterMenu_1.default.find(query).sort({ order: 1 });
        res.json(links);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching footer menus' });
    }
});
exports.getFooterMenus = getFooterMenus;
const createFooterMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionTitle, menuTitle, menuLink, order, isActive } = req.body;
        const newMenu = new FooterMenu_1.default({
            sectionTitle,
            menuTitle,
            menuLink,
            order: order !== undefined ? order : 0,
            isActive: isActive !== undefined ? isActive : true,
        });
        const savedMenu = yield newMenu.save();
        res.status(201).json(savedMenu);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating footer menu' });
    }
});
exports.createFooterMenu = createFooterMenu;
const updateFooterMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionTitle, menuTitle, menuLink, order, isActive } = req.body;
        const menu = yield FooterMenu_1.default.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: 'Footer menu not found' });
        }
        menu.sectionTitle = sectionTitle !== undefined ? sectionTitle : menu.sectionTitle;
        menu.menuTitle = menuTitle !== undefined ? menuTitle : menu.menuTitle;
        menu.menuLink = menuLink !== undefined ? menuLink : menu.menuLink;
        menu.order = order !== undefined ? order : menu.order;
        menu.isActive = isActive !== undefined ? isActive : menu.isActive;
        const updatedMenu = yield menu.save();
        res.json(updatedMenu);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating footer menu' });
    }
});
exports.updateFooterMenu = updateFooterMenu;
const deleteFooterMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menu = yield FooterMenu_1.default.findByIdAndDelete(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: 'Footer menu not found' });
        }
        res.json({ message: 'Footer menu removed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting footer menu' });
    }
});
exports.deleteFooterMenu = deleteFooterMenu;
const reorderFooterMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orders } = req.body; // Array of { id: string, order: number }
        if (!Array.isArray(orders)) {
            return res.status(400).json({ message: 'Orders must be an array of { id, order } objects' });
        }
        const bulkOps = orders.map((item) => ({
            updateOne: {
                filter: { _id: item.id },
                update: { $set: { order: item.order } },
            },
        }));
        yield FooterMenu_1.default.bulkWrite(bulkOps);
        res.json({ message: 'Footer menus reordered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error reordering footer menus' });
    }
});
exports.reorderFooterMenus = reorderFooterMenus;
