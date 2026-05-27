import mongoose, { Document, Schema } from 'mongoose';

export interface INavbar extends Document {
  title: string;
  link: string;
  order: number;
  isVisible: boolean;
}

const navbarSchema = new Schema<INavbar>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Navbar = mongoose.model<INavbar>('Navbar', navbarSchema);

export default Navbar;
