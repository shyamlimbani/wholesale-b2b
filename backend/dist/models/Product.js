"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    image: {
        type: String,
    },
    images: [{
            type: String,
        }],
    sku: { type: String },
    hsnCode: { type: String },
    piecesPerCarton: { type: String },
    stock: { type: String },
    stockQuantity: { type: Number, default: 0 },
    dimensions: { type: String },
    productWeight: { type: String },
    shippingWeight: { type: String },
    specifications: {
        type: String,
    },
    material: {
        type: String,
    },
    usage: {
        type: String,
    },
    features: {
        type: String,
    },
    whatsapp: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Product", productSchema);
