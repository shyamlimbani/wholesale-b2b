import { Request, Response } from 'express';
import Banner from '../models/Banner';
import asyncWrapper from '../utils/asyncWrapper';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

export const getBanners = asyncWrapper(async (req: Request, res: Response) => {
  const query: any = {};
  // If not admin/authenticated or if public request, only fetch active banners
  if (req.query.active === 'true') {
    query.isActive = true;
  }
  const banners = await Banner.find(query).sort({ order: 1 });
  res.json(banners);
});

export const getBannerById = asyncWrapper(async (req: Request, res: Response) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) {
    res.json(banner);
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

export const createBanner = asyncWrapper(async (req: Request, res: Response) => {
  const { image, link, order, isActive } = req.body;

  if (!image) {
    res.status(400);
    throw new Error('Please provide a banner image URL');
  }

  const banner = new Banner({
    image,
    link,
    order: Number(order) || 0,
    isActive: isActive === 'true' || isActive === true,
  });

  const createdBanner = await banner.save();
  res.status(201).json(createdBanner);
});

export const updateBanner = asyncWrapper(async (req: Request, res: Response) => {
  const { image, link, order, isActive } = req.body;

  const banner = await Banner.findById(req.params.id);

  if (banner) {
    banner.image = image || banner.image;
    banner.link = link !== undefined ? link : banner.link;
    banner.order = order !== undefined ? Number(order) : banner.order;
    banner.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : banner.isActive;

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

export const deleteBanner = asyncWrapper(async (req: Request, res: Response) => {
  const banner = await Banner.findById(req.params.id);

  if (banner) {
    await Banner.deleteOne({ _id: banner._id });
    res.json({ message: 'Banner removed' });
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});
