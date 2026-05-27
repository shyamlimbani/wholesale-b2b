import { Request, Response } from 'express';
import Lead from '../models/Lead';

export const createLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const query: any = {};
    
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { mobile: searchRegex },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      leads,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Lead record deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
};
