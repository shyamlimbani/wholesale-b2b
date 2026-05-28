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
exports.updatePopupSettings = exports.getPopupSettings = void 0;
const PopupSetting_1 = __importDefault(require("../models/PopupSetting"));
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const cloudinaryUpload_1 = require("../utils/cloudinaryUpload");
exports.getPopupSettings = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let settings = yield PopupSetting_1.default.findOne({});
    if (!settings) {
        // Create default settings if none exist yet
        settings = new PopupSetting_1.default({
            title: "Welcome to India's Trusted Wholesale Marketplace",
            subtitle: 'Connect with verified suppliers and buyers instantly.',
            description: 'Please enter your credentials to explore the premium wholesale catalog, download bulk catalogs, and request direct factory pricing.',
            logo: '',
            backgroundImage: '',
            buttonText: 'Explore Wholesale Deals',
            termsText: 'Verified B2B Business Verification',
            isEnabled: true,
        });
        yield settings.save();
    }
    res.json(settings);
}));
exports.updatePopupSettings = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subtitle, description, buttonText, termsText, isEnabled, logo, backgroundImage, image, } = req.body;
    let settings = yield PopupSetting_1.default.findOne({});
    if (!settings) {
        settings = new PopupSetting_1.default({});
    }
    // Update text fields
    if (title !== undefined)
        settings.title = title;
    if (subtitle !== undefined)
        settings.subtitle = subtitle;
    if (description !== undefined)
        settings.description = description;
    if (buttonText !== undefined)
        settings.buttonText = buttonText;
    if (termsText !== undefined)
        settings.termsText = termsText;
    if (isEnabled !== undefined)
        settings.isEnabled = isEnabled === 'true' || isEnabled === true;
    // If text urls are sent directly
    if (logo !== undefined)
        settings.logo = logo;
    if (backgroundImage !== undefined)
        settings.backgroundImage = backgroundImage;
    if (image !== undefined)
        settings.image = image;
    // Handle file uploads
    const files = req.files;
    if (files) {
        if (files.logo && files.logo[0]) {
            try {
                settings.logo = yield (0, cloudinaryUpload_1.uploadToCloudinary)(files.logo[0].buffer, 'popup_settings');
            }
            catch (err) {
                console.warn('Cloudinary upload failed for logo, falling back to base64:', err);
                const mimeType = files.logo[0].mimetype || 'image/png';
                settings.logo = `data:${mimeType};base64,${files.logo[0].buffer.toString('base64')}`;
            }
        }
        if (files.backgroundImage && files.backgroundImage[0]) {
            try {
                settings.backgroundImage = yield (0, cloudinaryUpload_1.uploadToCloudinary)(files.backgroundImage[0].buffer, 'popup_settings');
            }
            catch (err) {
                console.warn('Cloudinary upload failed for backgroundImage, falling back to base64:', err);
                const mimeType = files.backgroundImage[0].mimetype || 'image/png';
                settings.backgroundImage = `data:${mimeType};base64,${files.backgroundImage[0].buffer.toString('base64')}`;
            }
        }
        if (files.image && files.image[0]) {
            try {
                settings.image = yield (0, cloudinaryUpload_1.uploadToCloudinary)(files.image[0].buffer, 'popup_settings');
            }
            catch (err) {
                console.warn('Cloudinary upload failed for image, falling back to base64:', err);
                const mimeType = files.image[0].mimetype || 'image/png';
                settings.image = `data:${mimeType};base64,${files.image[0].buffer.toString('base64')}`;
            }
        }
    }
    const updatedSettings = yield settings.save();
    res.json(updatedSettings);
}));
