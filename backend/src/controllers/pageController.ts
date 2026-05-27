import { Request, Response } from 'express';
import Page from '../models/Page';

export const getPages = async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query.active === 'true') {
      query.isActive = true;
    }
    const pages = await Page.find(query).sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages' });
  }
};

export const getPageBySlug = async (req: Request, res: Response) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isActive: true });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page' });
  }
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, heroSubtitle, seoTitle, seoDescription, isActive } = req.body;
    
    const existing = await Page.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Page with this slug already exists' });
    }
    
    const newPage = new Page({ title, slug, content, heroSubtitle, seoTitle, seoDescription, isActive });
    const savedPage = await newPage.save();
    res.status(201).json(savedPage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating page' });
  }
};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, heroSubtitle, seoTitle, seoDescription, isActive } = req.body;
    const page = await Page.findById(req.params.id);
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    if (slug && slug !== page.slug) {
      const existing = await Page.findOne({ slug });
      if (existing) {
        return res.status(400).json({ message: 'Page with this slug already exists' });
      }
    }
    
    page.title = title || page.title;
    page.slug = slug || page.slug;
    page.content = content !== undefined ? content : page.content;
    page.heroSubtitle = heroSubtitle !== undefined ? heroSubtitle : page.heroSubtitle;
    page.seoTitle = seoTitle !== undefined ? seoTitle : page.seoTitle;
    page.seoDescription = seoDescription !== undefined ? seoDescription : page.seoDescription;
    page.isActive = isActive !== undefined ? isActive : page.isActive;
    
    const updatedPage = await page.save();
    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating page' });
  }
};

export const deletePage = async (req: Request, res: Response) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json({ message: 'Page removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page' });
  }
};
