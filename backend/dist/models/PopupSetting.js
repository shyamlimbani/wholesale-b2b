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
const popupSettingSchema = new mongoose_1.Schema({
    title: {
        type: String,
        default: "Welcome to India's Trusted Wholesale Marketplace"
    },
    subtitle: {
        type: String,
        default: 'Connect with verified suppliers and buyers instantly.'
    },
    description: {
        type: String,
        default: 'Please enter your credentials to explore the premium wholesale catalog, download bulk catalogs, and request direct factory pricing.'
    },
    logo: {
        type: String,
        default: ''
    },
    backgroundImage: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    buttonText: {
        type: String,
        default: 'Explore Wholesale Deals'
    },
    termsText: {
        type: String,
        default: 'Verified B2B Business Verification'
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
});
const PopupSetting = mongoose_1.default.models.PopupSetting || mongoose_1.default.model('PopupSetting', popupSettingSchema);
exports.default = PopupSetting;
