import mongoose, { Document, Schema } from 'mongoose';

export interface IFooterMenu extends Document {
  sectionTitle: string;
  menuTitle: string;
  menuLink: string;
  order: number;
  isActive: boolean;
}

const footerMenuSchema = new Schema<IFooterMenu>(
  {
    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    menuTitle: {
      type: String,
      required: true,
      trim: true,
    },
    menuLink: {
      type: String,
      required: true,
      trim: true,
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

const FooterMenu = mongoose.model<IFooterMenu>('FooterMenu', footerMenuSchema);

export default FooterMenu;
