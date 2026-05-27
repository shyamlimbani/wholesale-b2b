import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

const bannerSchema = new Schema<IBanner>(
  {
    image: {
      type: String, 
      required: true,
    },
    link: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model<IBanner>('Banner', bannerSchema);

export default Banner;
