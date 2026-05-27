import { Request, Response } from 'express';
import PopupSetting from '../models/PopupSetting';
import asyncWrapper from '../utils/asyncWrapper';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

export const getPopupSettings = asyncWrapper(async (req: Request, res: Response) => {
  let settings = await PopupSetting.findOne({});
  if (!settings) {
    // Create default settings if none exist yet
    settings = new PopupSetting({
      title: "Welcome to India's Trusted Wholesale Marketplace",
      subtitle: 'Connect with verified suppliers and buyers instantly.',
      description: 'Please enter your credentials to explore the premium wholesale catalog, download bulk catalogs, and request direct factory pricing.',
      logo: '',
      backgroundImage: '',
      buttonText: 'Explore Wholesale Deals',
      termsText: 'Verified B2B Business Verification',
      isEnabled: true,
    });
    await settings.save();
  }
  res.json(settings);
});

export const updatePopupSettings = asyncWrapper(async (req: Request, res: Response) => {
  const {
    title,
    subtitle,
    description,
    buttonText,
    termsText,
    isEnabled,
    logo,
    backgroundImage,
  } = req.body;

  let settings = await PopupSetting.findOne({});
  if (!settings) {
    settings = new PopupSetting({});
  }

  // Update text fields
  if (title !== undefined) settings.title = title;
  if (subtitle !== undefined) settings.subtitle = subtitle;
  if (description !== undefined) settings.description = description;
  if (buttonText !== undefined) settings.buttonText = buttonText;
  if (termsText !== undefined) settings.termsText = termsText;
  if (isEnabled !== undefined) settings.isEnabled = isEnabled === 'true' || isEnabled === true;

  // If text urls are sent directly
  if (logo !== undefined) settings.logo = logo;
  if (backgroundImage !== undefined) settings.backgroundImage = backgroundImage;

  // Handle file uploads
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files) {
    if (files.logo && files.logo[0]) {
      try {
        settings.logo = await uploadToCloudinary(files.logo[0].buffer, 'popup_settings');
      } catch (err) {
        console.warn('Cloudinary upload failed for logo, falling back to base64:', err);
        const mimeType = files.logo[0].mimetype || 'image/png';
        settings.logo = `data:${mimeType};base64,${files.logo[0].buffer.toString('base64')}`;
      }
    }
    if (files.backgroundImage && files.backgroundImage[0]) {
      try {
        settings.backgroundImage = await uploadToCloudinary(files.backgroundImage[0].buffer, 'popup_settings');
      } catch (err) {
        console.warn('Cloudinary upload failed for backgroundImage, falling back to base64:', err);
        const mimeType = files.backgroundImage[0].mimetype || 'image/png';
        settings.backgroundImage = `data:${mimeType};base64,${files.backgroundImage[0].buffer.toString('base64')}`;
      }
    }
  }

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});
