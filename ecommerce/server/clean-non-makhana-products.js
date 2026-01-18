// Script to remove all non-Makhana products from the database
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function cleanProducts() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await Product.deleteMany({ category: { $ne: 'Makhana' } });
  console.log(`Deleted ${result.deletedCount} non-Makhana products.`);
  await mongoose.disconnect();
}

cleanProducts().catch(err => {
  console.error('Error cleaning products:', err);
  process.exit(1);
});
