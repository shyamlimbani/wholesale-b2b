import { Request, Response } from 'express';
import Settings from '../models/Settings';
import asyncWrapper from '../utils/asyncWrapper';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

export const getSettings = asyncWrapper(async (req: Request, res: Response) => {
  let settings = await Settings.findOne({});
  if (!settings) {
    // Create default settings if none exist yet
    settings = new Settings({
      whatsappNumber: '919999999999',
      websiteName: 'B2B Wholesale',
      seoTitle: 'B2B Wholesale Marketplace - Sourcing Products Globally',
      seoDescription: 'Find global manufacturers, suppliers, exporters, and importers on our premium B2B wholesale marketplace.',
      footerText: '© 2026 B2B Wholesale Marketplace. All rights reserved.',
      footerDescription: 'Connecting wholesale B2B buyers with verified manufacturers and direct suppliers globally. Simplify your bulk sourcing process.',
      contactEmail: 'info@indib2bwholesale.com',
      contactAddress: 'Industrial Sector 62, Noida, Uttar Pradesh, India',
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
      },
    });
    await settings.save();
  }
  res.json(settings);
});

export const updateSettings = asyncWrapper(async (req: Request, res: Response) => {
  const {
    logo,
    footerLogo,
    whatsappNumber,
    websiteName,
    seoTitle,
    seoDescription,
    footerText,
    footerDescription,
    contactEmail,
    contactAddress,
    facebook,
    instagram,
    twitter,
    linkedin,
  } = req.body;

  let settings = await Settings.findOne({});
  if (!settings) {
    settings = new Settings({ 
      whatsappNumber: whatsappNumber !== undefined ? whatsappNumber : '', 
      websiteName: websiteName !== undefined ? websiteName : 'B2B Wholesale' 
    });
  }

  settings.whatsappNumber = whatsappNumber !== undefined ? whatsappNumber : settings.whatsappNumber;
  settings.websiteName = websiteName !== undefined ? websiteName : settings.websiteName;
  settings.seoTitle = seoTitle !== undefined ? seoTitle : settings.seoTitle;
  settings.seoDescription = seoDescription !== undefined ? seoDescription : settings.seoDescription;
  settings.footerText = footerText !== undefined ? footerText : settings.footerText;
  settings.footerDescription = footerDescription !== undefined ? footerDescription : settings.footerDescription;
  settings.contactEmail = contactEmail !== undefined ? contactEmail : settings.contactEmail;
  settings.contactAddress = contactAddress !== undefined ? contactAddress : settings.contactAddress;

  if (logo !== undefined) {
    settings.logo = logo;
  }
  if (footerLogo !== undefined) {
    settings.footerLogo = footerLogo;
  }

  if (settings.socialLinks) {
    settings.socialLinks.facebook = facebook !== undefined ? facebook : settings.socialLinks.facebook;
    settings.socialLinks.instagram = instagram !== undefined ? instagram : settings.socialLinks.instagram;
    settings.socialLinks.twitter = twitter !== undefined ? twitter : settings.socialLinks.twitter;
    settings.socialLinks.linkedin = linkedin !== undefined ? linkedin : settings.socialLinks.linkedin;
  } else {
    settings.socialLinks = {
      facebook,
      instagram,
      twitter,
      linkedin,
    };
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files) {
    if (files.logo && files.logo[0]) {
      try {
        settings.logo = await uploadToCloudinary(files.logo[0].buffer, 'settings');
      } catch (err) {
        console.warn('Cloudinary upload failed for logo, falling back to base64:', err);
        const mimeType = files.logo[0].mimetype || 'image/png';
        settings.logo = `data:${mimeType};base64,${files.logo[0].buffer.toString('base64')}`;
      }
    }
    if (files.footerLogo && files.footerLogo[0]) {
      try {
        settings.footerLogo = await uploadToCloudinary(files.footerLogo[0].buffer, 'settings');
      } catch (err) {
        console.warn('Cloudinary upload failed for footerLogo, falling back to base64:', err);
        const mimeType = files.footerLogo[0].mimetype || 'image/png';
        settings.footerLogo = `data:${mimeType};base64,${files.footerLogo[0].buffer.toString('base64')}`;
      }
    }
  }

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});
