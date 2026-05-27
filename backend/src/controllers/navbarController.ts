import { Request, Response } from 'express';
import Navbar from '../models/Navbar';

export const getNavbarLinks = async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query.active === 'true') {
      query.isVisible = true;
    }
    const links = await Navbar.find(query).sort({ order: 1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching navbar links' });
  }
};

export const createNavbarLink = async (req: Request, res: Response) => {
  try {
    const { title, link, order, isVisible } = req.body;
    
    const newLink = new Navbar({ title, link, order, isVisible });
    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (error) {
    res.status(500).json({ message: 'Error creating navbar link' });
  }
};

export const updateNavbarLink = async (req: Request, res: Response) => {
  try {
    const { title, link, order, isVisible } = req.body;
    const navLink = await Navbar.findById(req.params.id);
    
    if (!navLink) {
      return res.status(404).json({ message: 'Navbar link not found' });
    }
    
    navLink.title = title || navLink.title;
    navLink.link = link || navLink.link;
    navLink.order = order !== undefined ? order : navLink.order;
    navLink.isVisible = isVisible !== undefined ? isVisible : navLink.isVisible;
    
    const updatedLink = await navLink.save();
    res.json(updatedLink);
  } catch (error) {
    res.status(500).json({ message: 'Error updating navbar link' });
  }
};

export const deleteNavbarLink = async (req: Request, res: Response) => {
  try {
    const navLink = await Navbar.findByIdAndDelete(req.params.id);
    if (!navLink) {
      return res.status(404).json({ message: 'Navbar link not found' });
    }
    res.json({ message: 'Navbar link removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting navbar link' });
  }
};
