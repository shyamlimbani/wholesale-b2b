const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/wholesale_b2b';

async function sanitizeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // We don't have the explicit model here, so let's just use the native driver collection
    const collection = mongoose.connection.collection('products');
    
    const products = await collection.find({}).toArray();
    let updatedCount = 0;

    for (const product of products) {
      let changed = false;
      
      const newImages = [];
      if (product.images && Array.isArray(product.images)) {
        for (const img of product.images) {
          if (typeof img === 'string') {
            const clean = img.replace(/\s/g, "");
            newImages.push(clean);
            if (clean !== img) {
              changed = true;
            }
          } else {
            newImages.push(img);
          }
        }
      }

      let newImage = product.image;
      if (typeof newImage === 'string') {
        const clean = newImage.replace(/\s/g, "");
        if (clean !== newImage) {
          newImage = clean;
          changed = true;
        }
      }

      if (changed) {
        await collection.updateOne(
          { _id: product._id },
          { $set: { images: newImages, image: newImage || (newImages.length > 0 ? newImages[0] : "") } }
        );
        updatedCount++;
        console.log(`Sanitized product: ${product.title}`);
      }
    }

    console.log(`Finished. Updated ${updatedCount} products.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

sanitizeDatabase();
