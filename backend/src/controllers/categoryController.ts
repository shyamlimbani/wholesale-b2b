import { Request, Response } from 'express';
import Category from '../models/Category';
import asyncWrapper from '../utils/asyncWrapper';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

export const getCategories = asyncWrapper(async (req: Request, res: Response) => {
  const categories = await Category.find({}).populate('parent');
  res.json(categories);
});

export const getCategoryById = asyncWrapper(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id).populate('parent');
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export const createCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { name, slug, description, parent } = req.body;

  const categoryExists = await Category.findOne({ slug });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category with this slug already exists');
  }

  let imageUrl = '';
  if (req.file) {
    imageUrl = await uploadToCloudinary(req.file.buffer, 'categories');
  }

  const category = new Category({
    name,
    slug,
    description,
    parent: parent || null,
    image: imageUrl,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

export const updateCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { name, slug, description, parent } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.description = description || category.description;
    category.parent = parent || category.parent;

    if (req.file) {
      category.image = await uploadToCloudinary(req.file.buffer, 'categories');
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export const deleteCategory = asyncWrapper(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});
