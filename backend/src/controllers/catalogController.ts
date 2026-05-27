import { Request, Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import Product from '../models/Product';
import Category from '../models/Category';
import Settings from '../models/Settings';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import mongoose from 'mongoose';

export const downloadCatalog = asyncWrapper(async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  let productQuery: any = {};
  let categoryName = 'All Products Catalog';

  if (categoryId && categoryId !== 'all') {
    // Try to find the category by slug first (handles string IDs like "cat-1779...")
    // Fall back to ObjectId lookup only if the param is a valid ObjectId
    let category = await Category.findOne({ slug: categoryId });

    if (!category && mongoose.isValidObjectId(categoryId)) {
      category = await Category.findById(categoryId);
    }

    if (!category) {
      res.status(404).json({ message: `Category not found: ${categoryId}` });
      return;
    }

    categoryName = `${category.name} Catalog`;
    // Products store category as the category's _id string
    productQuery.category = category._id.toString();
  }

  const products = await Product.find(productQuery).sort({ createdAt: -1 });

  const settings = await Settings.findOne();
  const companyName = settings?.websiteName || 'Wholesale B2B';

  // Create PDF
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Set response headers for download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${categoryName.replace(/\s+/g, '_')}.pdf"`);

  doc.pipe(res);

  // Helper to draw Header
  const drawHeader = (pageTitle: string) => {
    doc.fillColor('#1f2937').fontSize(24).font('Helvetica-Bold').text(companyName, { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor('#4b5563').fontSize(14).font('Helvetica').text(pageTitle, { align: 'center' });
    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor('#e5e7eb').lineWidth(2).stroke();
    doc.moveDown(1.5);
  };

  // Helper to draw Footer
  const drawFooter = () => {
    let pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      const bottom = doc.page.height - 40;
      doc.moveTo(40, bottom - 10).lineTo(555, bottom - 10).strokeColor('#e5e7eb').lineWidth(1).stroke();
      doc.fontSize(10).fillColor('#9ca3af').text(`Page ${i + 1} of ${pages.count}`, 40, bottom, { align: 'center' });
    }
  };

  let itemsOnPage = 0;
  const ITEMS_PER_PAGE = 10;
  const startY = 130;
  const rowHeight = 70;

  drawHeader(categoryName);

  if (products.length === 0) {
    doc.fillColor('#6b7280').fontSize(14).text('No products found in this category.', { align: 'center' });
  }

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    if (itemsOnPage >= ITEMS_PER_PAGE) {
      doc.addPage();
      drawHeader(categoryName);
      itemsOnPage = 0;
    }

    const y = doc.y;

    // Background for alternate rows (optional)
    if (itemsOnPage % 2 === 0) {
      doc.rect(40, y - 5, 515, rowHeight).fill('#f9fafb');
    }

    // Try to load image
    let imageOffset = 0;
    if (product.image) {
      try {
        const imageResponse = await axios.get(product.image, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
        doc.image(imageBuffer, 45, y, { fit: [50, 50], align: 'center', valign: 'center' });
      } catch (err) {
        // Fallback if image fetch fails
        doc.rect(45, y, 50, 50).fillAndStroke('#f3f4f6', '#d1d5db');
      }
      imageOffset = 60;
    }

    // Text Content
    doc.fillColor('#1f2937').fontSize(12).font('Helvetica-Bold').text(product.name || 'Unnamed Product', 45 + imageOffset, y + 5);
    
    doc.fillColor('#6b7280').fontSize(10).font('Helvetica').text(`SKU: ${product.sku || 'N/A'}`, 45 + imageOffset, y + 22);

    doc.fillColor('#3b82f6').fontSize(11).font('Helvetica-Bold').text(`Rs. ${product.price?.toLocaleString('en-IN') || 0}`, 45 + imageOffset, y + 37);

    // Stock status
    const stockStatus = product.stock || 'In Stock';
    const isOut = stockStatus.toLowerCase().includes('out');
    doc.fillColor(isOut ? '#ef4444' : '#10b981').fontSize(10).font('Helvetica-Bold').text(stockStatus, 450, y + 20, { align: 'right' });

    doc.y = y + rowHeight;
    itemsOnPage++;
  }

  drawFooter();
  doc.end();
});
