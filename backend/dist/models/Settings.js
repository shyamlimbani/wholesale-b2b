"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const settingsSchema = new mongoose_1.Schema({
    logo: {
        type: String, // Cloudinary URL
    },
    footerLogo: {
        type: String, // Cloudinary URL
    },
    whatsappNumber: {
        type: String,
        required: false,
    },
    websiteName: {
        type: String,
        required: false,
        default: 'Wholesale B2B',
    },
    seoTitle: {
        type: String,
    },
    seoDescription: {
        type: String,
    },
    footerText: {
        type: String,
    },
    socialLinks: {
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
    },
    searchPlaceholder: {
        type: String,
        default: 'Search For items...',
    },
    navbarBgColor: {
        type: String,
        default: '#ffffff', // white
    },
    navbarTextColor: {
        type: String,
        default: '#1f2937', // gray-800
    },
    headerSpacingY: {
        type: String,
        default: '4', // py-4 equivalent
    },
    footerDescription: {
        type: String,
    },
    contactEmail: {
        type: String,
    },
    contactAddress: {
        type: String,
    },
}, {
    timestamps: true,
});
const Settings = mongoose_1.default.model('Settings', settingsSchema);
exports.default = Settings;
