import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { Parser } from 'json2csv';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
) => {

  try {

    console.log("BODY:", req.body);

    const product =
      await Product.create(req.body);

    res.status(201).json(product);

  } catch (error: any) {

    console.log("========= ERROR =========");

    console.log(error);

    console.log(error.message);

    console.log("=========================");

    res.status(500).json({
      message: error.message,
    });

  }

};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, price, description, category, image, images, 
      sku, hsnCode, piecesPerCarton, stock, stockQuantity, dimensions, productWeight, shippingWeight,
      specifications, material, usage, features, whatsapp 
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      if (price !== undefined) product.price = Number(price);
      product.description = description || product.description;
      product.category = category || product.category;
      
      if (image !== undefined) {
        let cleanImage = image;
        if (cleanImage) {
          cleanImage = cleanImage.trim().replace(/\s/g, "");
        }
        product.image = cleanImage;
      }
      
      if (images !== undefined) product.images = images;
      if (sku !== undefined) product.sku = sku;
      if (hsnCode !== undefined) product.hsnCode = hsnCode;
      if (piecesPerCarton !== undefined) product.piecesPerCarton = piecesPerCarton;
      if (stock !== undefined) product.stock = stock;
      if (stockQuantity !== undefined) product.stockQuantity = Number(stockQuantity);
      if (dimensions !== undefined) product.dimensions = dimensions;
      if (productWeight !== undefined) product.productWeight = productWeight;
      if (shippingWeight !== undefined) product.shippingWeight = shippingWeight;

      if (specifications !== undefined) product.specifications = specifications;
      if (material !== undefined) product.material = material;
      if (usage !== undefined) product.usage = usage;
      if (features !== undefined) product.features = features;
      
      product.whatsapp = whatsapp || product.whatsapp;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

export const exportProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    const categories = await Category.find({});
    
    // Create mapping from category id to category name
    const categoryMap: Record<string, string> = {};
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = cat.name;
    });

    const fields = [
      'name',
      'price',
      'description',
      'category',
      'image',
      'whatsapp',
      'sku',
      'hsnCode',
      'piecesPerCarton',
      'stock',
      'dimensions',
      'productWeight',
      'shippingWeight'
    ];

    const data = products.map(p => ({
      name: p.name || '',
      price: p.price || 0,
      description: p.description || '',
      category: p.category ? (categoryMap[p.category] || p.category) : '',
      image: p.image || '',
      whatsapp: p.whatsapp || '',
      sku: p.sku || '',
      hsnCode: p.hsnCode || '',
      piecesPerCarton: p.piecesPerCarton || '',
      stock: p.stock || '',
      dimensions: p.dimensions || '',
      productWeight: p.productWeight || '',
      shippingWeight: p.shippingWeight || ''
    }));

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('products.csv');
    return res.send(csv);
  } catch (error: any) {
    console.error('CSV Export Error:', error);
    res.status(500).json({ message: error.message || 'Error exporting products' });
  }
};

export const importProducts = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results: any[] = [];
    const stream = Readable.from(req.file.buffer.toString());

    stream
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        let importedCount = 0;
        let failedCount = 0;
        const failedRows: any[] = [];

        // Pre-fetch all categories to build cache
        const allCategories = await Category.find({});
        const categoryCache: Record<string, string> = {}; // Name to ID map
        allCategories.forEach(cat => {
          categoryCache[cat.name.toLowerCase().trim()] = cat._id.toString();
        });

        // Key helper for case-insensitivity
        const getRowVal = (row: any, key: string) => {
          const foundKey = Object.keys(row).find(
            (k) => k.toLowerCase().trim() === key.toLowerCase().trim()
          );
          return foundKey ? row[foundKey] : undefined;
        };

        for (let i = 0; i < results.length; i++) {
          const row = results[i];
          const rawName = getRowVal(row, 'name');
          const name = typeof rawName === 'string' ? rawName.trim() : undefined;

          // Ignore empty rows
          if (!name) {
            continue;
          }

          try {
            const rawPrice = getRowVal(row, 'price');
            const price = parseFloat(rawPrice || '0');

            // Resolve Category
            let categoryId = '';
            const rawCategoryName = getRowVal(row, 'category');
            const categoryName = typeof rawCategoryName === 'string' ? rawCategoryName.trim() : undefined;

            if (categoryName) {
              const cacheKey = categoryName.toLowerCase();
              if (categoryCache[cacheKey]) {
                categoryId = categoryCache[cacheKey];
              } else {
                // Create Category on the fly
                const categorySlug = categoryName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '');
                
                const newCat = await Category.create({
                  name: categoryName,
                  slug: categorySlug,
                });
                
                categoryId = newCat._id.toString();
                categoryCache[cacheKey] = categoryId; // Add to cache
              }
            }

            // SKU & Name duplicate checking
            let product = null;
            const rawSku = getRowVal(row, 'sku');
            const sku = typeof rawSku === 'string' ? rawSku.trim() : undefined;

            if (sku) {
              product = await Product.findOne({ sku });
            } else {
              product = await Product.findOne({ name });
            }

            const rawDescription = getRowVal(row, 'description');
            const rawImage = getRowVal(row, 'image');
            const rawWhatsapp = getRowVal(row, 'whatsapp');
            const rawHsnCode = getRowVal(row, 'hsnCode');
            const rawPiecesPerCarton = getRowVal(row, 'piecesPerCarton');
            const rawStock = getRowVal(row, 'stock');
            const rawStockQty = getRowVal(row, 'stockQuantity');
            const rawDimensions = getRowVal(row, 'dimensions');
            const rawProductWeight = getRowVal(row, 'productWeight');
            const rawShippingWeight = getRowVal(row, 'shippingWeight');

            const productData = {
              name,
              price: isNaN(price) ? 0 : price,
              description: typeof rawDescription === 'string' ? rawDescription.trim() : '',
              category: categoryId,
              image: typeof rawImage === 'string' ? rawImage.trim() : '',
              whatsapp: typeof rawWhatsapp === 'string' ? rawWhatsapp.trim() : '',
              sku: sku || '',
              hsnCode: typeof rawHsnCode === 'string' ? rawHsnCode.trim() : '',
              piecesPerCarton: typeof rawPiecesPerCarton === 'string' ? rawPiecesPerCarton.trim() : '',
              stock: typeof rawStock === 'string' ? rawStock.trim() : 'In Stock',
              stockQuantity: rawStockQty ? parseInt(rawStockQty) : (rawStock === 'Out of Stock' ? 0 : 100),
              dimensions: typeof rawDimensions === 'string' ? rawDimensions.trim() : '',
              productWeight: typeof rawProductWeight === 'string' ? rawProductWeight.trim() : '',
              shippingWeight: typeof rawShippingWeight === 'string' ? rawShippingWeight.trim() : ''
            };

            if (product) {
              // Update existing
              Object.assign(product, productData);
              await product.save();
            } else {
              // Create new
              await Product.create(productData);
            }

            importedCount++;
          } catch (err: any) {
            failedCount++;
            failedRows.push({ rowNumber: i + 1, rowData: row, error: err.message });
          }
        }

        res.json({
          success: true,
          message: `Successfully imported ${importedCount} products.`,
          importedCount,
          failedCount,
          failedRows,
        });
      });
  } catch (error: any) {
    console.error('CSV Import Error:', error);
    res.status(500).json({ message: error.message || 'Error importing products' });
  }
};
