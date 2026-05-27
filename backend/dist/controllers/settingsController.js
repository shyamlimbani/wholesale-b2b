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
exports.updateSettings = exports.getSettings = void 0;
const Settings_1 = __importDefault(require("../models/Settings"));
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const cloudinaryUpload_1 = require("../utils/cloudinaryUpload");
exports.getSettings = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let settings = yield Settings_1.default.findOne({});
    if (!settings) {
        // Create default settings if none exist yet
        settings = new Settings_1.default({
            whatsappNumber: '919999999999',
            websiteName: 'B2B Wholesale',
            seoTitle: 'B2B Wholesale Marketplace - Sourcing Products Globally',
            seoDescription: 'Find global manufacturers, suppliers, exporters, and importers on our premium B2B wholesale marketplace.',
            footerText: '© 2026 B2B Wholesale Marketplace. All rights reserved.',
            footerDescription: 'Connecting wholesale B2B buyers with verified manufacturers and direct suppliers globally. Simplify your bulk sourcing process.',
            contactEmail: 'info@indib2bwholesale.com',
            contactAddress: 'Industrial Sector 62, Noida, Uttar Pradesh, India',
            socialLinks: {
                facebook: 'https://facebook.com',
                instagram: 'https://instagram.com',
                twitter: 'https://twitter.com',
                linkedin: 'https://linkedin.com',
            },
        });
        yield settings.save();
    }
    res.json(settings);
}));
exports.updateSettings = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { logo, footerLogo, whatsappNumber, websiteName, seoTitle, seoDescription, footerText, footerDescription, contactEmail, contactAddress, facebook, instagram, twitter, linkedin, } = req.body;
    let settings = yield Settings_1.default.findOne({});
    if (!settings) {
        settings = new Settings_1.default({
            whatsappNumber: whatsappNumber !== undefined ? whatsappNumber : '',
            websiteName: websiteName !== undefined ? websiteName : 'B2B Wholesale'
        });
    }
    settings.whatsappNumber = whatsappNumber !== undefined ? whatsappNumber : settings.whatsappNumber;
    settings.websiteName = websiteName !== undefined ? websiteName : settings.websiteName;
    settings.seoTitle = seoTitle !== undefined ? seoTitle : settings.seoTitle;
    settings.seoDescription = seoDescription !== undefined ? seoDescription : settings.seoDescription;
    settings.footerText = footerText !== undefined ? footerText : settings.footerText;
    settings.footerDescription = footerDescription !== undefined ? footerDescription : settings.footerDescription;
    settings.contactEmail = contactEmail !== undefined ? contactEmail : settings.contactEmail;
    settings.contactAddress = contactAddress !== undefined ? contactAddress : settings.contactAddress;
    if (logo !== undefined) {
        settings.logo = logo;
    }
    if (footerLogo !== undefined) {
        settings.footerLogo = footerLogo;
    }
    if (settings.socialLinks) {
        settings.socialLinks.facebook = facebook !== undefined ? facebook : settings.socialLinks.facebook;
        settings.socialLinks.instagram = instagram !== undefined ? instagram : settings.socialLinks.instagram;
        settings.socialLinks.twitter = twitter !== undefined ? twitter : settings.socialLinks.twitter;
        settings.socialLinks.linkedin = linkedin !== undefined ? linkedin : settings.socialLinks.linkedin;
    }
    else {
        settings.socialLinks = {
            facebook,
            instagram,
            twitter,
            linkedin,
        };
    }
    const files = req.files;
    if (files) {
        if (files.logo && files.logo[0]) {
            try {
                settings.logo = yield (0, cloudinaryUpload_1.uploadToCloudinary)(files.logo[0].buffer, 'settings');
            }
            catch (err) {
                console.warn('Cloudinary upload failed for logo, falling back to base64:', err);
                const mimeType = files.logo[0].mimetype || 'image/png';
                settings.logo = `data:${mimeType};base64,${files.logo[0].buffer.toString('base64')}`;
            }
        }
        if (files.footerLogo && files.footerLogo[0]) {
            try {
                settings.footerLogo = yield (0, cloudinaryUpload_1.uploadToCloudinary)(files.footerLogo[0].buffer, 'settings');
            }
            catch (err) {
                console.warn('Cloudinary upload failed for footerLogo, falling back to base64:', err);
                const mimeType = files.footerLogo[0].mimetype || 'image/png';
                settings.footerLogo = `data:${mimeType};base64,${files.footerLogo[0].buffer.toString('base64')}`;
            }
        }
    }
    const updatedSettings = yield settings.save();
    res.json(updatedSettings);
}));
