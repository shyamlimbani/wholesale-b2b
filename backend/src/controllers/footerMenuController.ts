import { Request, Response } from 'express';
import FooterMenu from '../models/FooterMenu';

export const getFooterMenus = async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query.active === 'true') {
      query.isActive = true;
    }
    const links = await FooterMenu.find(query).sort({ order: 1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footer menus' });
  }
};

export const createFooterMenu = async (req: Request, res: Response) => {
  try {
    const { sectionTitle, menuTitle, menuLink, order, isActive } = req.body;
    
    const newMenu = new FooterMenu({
      sectionTitle,
      menuTitle,
      menuLink,
      order: order !== undefined ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    
    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (error) {
    res.status(500).json({ message: 'Error creating footer menu' });
  }
};

export const updateFooterMenu = async (req: Request, res: Response) => {
  try {
    const { sectionTitle, menuTitle, menuLink, order, isActive } = req.body;
    const menu = await FooterMenu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Footer menu not found' });
    }
    
    menu.sectionTitle = sectionTitle !== undefined ? sectionTitle : menu.sectionTitle;
    menu.menuTitle = menuTitle !== undefined ? menuTitle : menu.menuTitle;
    menu.menuLink = menuLink !== undefined ? menuLink : menu.menuLink;
    menu.order = order !== undefined ? order : menu.order;
    menu.isActive = isActive !== undefined ? isActive : menu.isActive;
    
    const updatedMenu = await menu.save();
    res.json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: 'Error updating footer menu' });
  }
};

export const deleteFooterMenu = async (req: Request, res: Response) => {
  try {
    const menu = await FooterMenu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Footer menu not found' });
    }
    res.json({ message: 'Footer menu removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting footer menu' });
  }
};

export const reorderFooterMenus = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body; // Array of { id: string, order: number }
    if (!Array.isArray(orders)) {
      return res.status(400).json({ message: 'Orders must be an array of { id, order } objects' });
    }

    const bulkOps = orders.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));

    await FooterMenu.bulkWrite(bulkOps);
    res.json({ message: 'Footer menus reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reordering footer menus' });
  }
};
