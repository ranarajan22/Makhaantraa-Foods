const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with filters, search, sort, pagination
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      rating, 
      sort = '-createdAt', 
      page = 1, 
      limit = 20,
      featured
    } = req.query;

    let query = { active: true };

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Featured products
    if (featured === 'true') {
      query.featured = true;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-reviews');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get price range
router.get('/meta/price-range', async (req, res) => {
  try {
    const minProduct = await Product.findOne({ active: true }).sort('price').select('price');
    const maxProduct = await Product.findOne({ active: true }).sort('-price').select('price');
    
    res.json({
      min: minProduct?.price || 0,
      max: maxProduct?.price || 10000
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product by ID (must be last to avoid shadowing /meta/* routes)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('relatedProducts', 'name price images mainImage rating');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
