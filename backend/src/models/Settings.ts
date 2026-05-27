import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  logo?: string;
  footerLogo?: string;
  whatsappNumber?: string;
  websiteName?: string;
  seoTitle?: string;
  seoDescription?: string;
  footerText?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  searchPlaceholder?: string;
  navbarBgColor?: string;
  navbarTextColor?: string;
  headerSpacingY?: string;
  footerDescription?: string;
  contactEmail?: string;
  contactAddress?: string;
}

const settingsSchema = new Schema<ISettings>(
  {
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
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model<ISettings>('Settings', settingsSchema);

export default Settings;
