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
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBannerById = exports.getBanners = void 0;
const Banner_1 = __importDefault(require("../models/Banner"));
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
exports.getBanners = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    // If not admin/authenticated or if public request, only fetch active banners
    if (req.query.active === 'true') {
        query.isActive = true;
    }
    const banners = yield Banner_1.default.find(query).sort({ order: 1 });
    res.json(banners);
}));
exports.getBannerById = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield Banner_1.default.findById(req.params.id);
    if (banner) {
        res.json(banner);
    }
    else {
        res.status(404);
        throw new Error('Banner not found');
    }
}));
exports.createBanner = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, link, order, isActive } = req.body;
    if (!image) {
        res.status(400);
        throw new Error('Please provide a banner image URL');
    }
    const banner = new Banner_1.default({
        image,
        link,
        order: Number(order) || 0,
        isActive: isActive === 'true' || isActive === true,
    });
    const createdBanner = yield banner.save();
    res.status(201).json(createdBanner);
}));
exports.updateBanner = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, link, order, isActive } = req.body;
    const banner = yield Banner_1.default.findById(req.params.id);
    if (banner) {
        banner.image = image || banner.image;
        banner.link = link !== undefined ? link : banner.link;
        banner.order = order !== undefined ? Number(order) : banner.order;
        banner.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : banner.isActive;
        const updatedBanner = yield banner.save();
        res.json(updatedBanner);
    }
    else {
        res.status(404);
        throw new Error('Banner not found');
    }
}));
exports.deleteBanner = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield Banner_1.default.findById(req.params.id);
    if (banner) {
        yield Banner_1.default.deleteOne({ _id: banner._id });
        res.json({ message: 'Banner removed' });
    }
    else {
        res.status(404);
        throw new Error('Banner not found');
    }
}));
