import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  sku: string;
  hsnCode: string;
  piecesPerCarton: string;
  stock: string;
  stockQuantity: number;
  dimensions: string;
  productWeight: string;
  shippingWeight: string;
  specifications: string;
  material: string;
  usage: string;
  features: string;
  whatsapp: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema({
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

export default mongoose.model<IProduct>(
  "Product",
  productSchema
);
