"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importProducts = exports.exportProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const json2csv_1 = require("json2csv");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find().sort({ createdAt: -1 });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.default.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("BODY:", req.body);
        const product = yield Product_1.default.create(req.body);
        res.status(201).json(product);
    }
    catch (error) {
        console.log("========= ERROR =========");
        console.log(error);
        console.log(error.message);
        console.log("=========================");
        res.status(500).json({
            message: error.message,
        });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, category, image, images, sku, hsnCode, piecesPerCarton, stock, stockQuantity, dimensions, productWeight, shippingWeight, specifications, material, usage, features, whatsapp } = req.body;
        const product = yield Product_1.default.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            if (price !== undefined)
                product.price = Number(price);
            product.description = description || product.description;
            product.category = category || product.category;
            if (image !== undefined) {
                let cleanImage = image;
                if (cleanImage) {
                    cleanImage = cleanImage.trim().replace(/\s/g, "");
                }
                product.image = cleanImage;
            }
            if (images !== undefined)
                product.images = images;
            if (sku !== undefined)
                product.sku = sku;
            if (hsnCode !== undefined)
                product.hsnCode = hsnCode;
            if (piecesPerCarton !== undefined)
                product.piecesPerCarton = piecesPerCarton;
            if (stock !== undefined)
                product.stock = stock;
            if (stockQuantity !== undefined)
                product.stockQuantity = Number(stockQuantity);
            if (dimensions !== undefined)
                product.dimensions = dimensions;
            if (productWeight !== undefined)
                product.productWeight = productWeight;
            if (shippingWeight !== undefined)
                product.shippingWeight = shippingWeight;
            if (specifications !== undefined)
                product.specifications = specifications;
            if (material !== undefined)
                product.material = material;
            if (usage !== undefined)
                product.usage = usage;
            if (features !== undefined)
                product.features = features;
            product.whatsapp = whatsapp || product.whatsapp;
            const updatedProduct = yield product.save();
            res.json(updatedProduct);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.default.findById(req.params.id);
        if (product) {
            yield product.deleteOne();
            res.json({ message: 'Product removed' });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});
exports.deleteProduct = deleteProduct;
const exportProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({});
        const categories = yield Category_1.default.find({});
        // Create mapping from category id to category name
        const categoryMap = {};
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
        const json2csvParser = new json2csv_1.Parser({ fields });
        const csv = json2csvParser.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment('products.csv');
        return res.send(csv);
    }
    catch (error) {
        console.error('CSV Export Error:', error);
        res.status(500).json({ message: error.message || 'Error exporting products' });
    }
});
exports.exportProducts = exportProducts;
const importProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a CSV file' });
        }
        const results = [];
        const stream = stream_1.Readable.from(req.file.buffer.toString());
        stream
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => results.push(data))
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            let importedCount = 0;
            let failedCount = 0;
            const failedRows = [];
            // Pre-fetch all categories to build cache
            const allCategories = yield Category_1.default.find({});
            const categoryCache = {}; // Name to ID map
            allCategories.forEach(cat => {
                categoryCache[cat.name.toLowerCase().trim()] = cat._id.toString();
            });
            // Key helper for case-insensitivity
            const getRowVal = (row, key) => {
                const foundKey = Object.keys(row).find((k) => k.toLowerCase().trim() === key.toLowerCase().trim());
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
                        }
                        else {
                            // Create Category on the fly
                            const categorySlug = categoryName
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)/g, '');
                            const newCat = yield Category_1.default.create({
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
                        product = yield Product_1.default.findOne({ sku });
                    }
                    else {
                        product = yield Product_1.default.findOne({ name });
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
                        yield product.save();
                    }
                    else {
                        // Create new
                        yield Product_1.default.create(productData);
                    }
                    importedCount++;
                }
                catch (err) {
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
        }));
    }
    catch (error) {
        console.error('CSV Import Error:', error);
        res.status(500).json({ message: error.message || 'Error importing products' });
    }
});
exports.importProducts = importProducts;
