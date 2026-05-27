import mongoose, { Schema, Model } from 'mongoose';

const popupSettingSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const PopupSetting: Model<any> = mongoose.models.PopupSetting || mongoose.model('PopupSetting', popupSettingSchema);

export default PopupSetting;
