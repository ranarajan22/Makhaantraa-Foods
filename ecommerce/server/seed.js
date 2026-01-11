const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Bamboo Chopping Board',
    description: 'Premium bamboo chopping board for kitchen use, eco-friendly and durable',
    price: 1299,
    category: 'Home Decor',
    mainImage: '/product_image/bombooChoppingBoard.jpg',
    images: ['/product_image/bombooChoppingBoard.jpg'],
    stock: 50,
    rating: 4.5,
    reviews: [],
    featured: true,
    active: true,
    soldCount: 12,
    viewCount: 150
  },
  {
    name: 'Elegant Bracelet',
    description: 'Handcrafted bracelet with beautiful beadwork',
    price: 2499,
    category: 'Jewelry',
    mainImage: '/product_image/bracelet.jpg',
    images: ['/product_image/bracelet.jpg'],
    stock: 30,
    rating: 4.7,
    reviews: [],
    featured: true,
    active: true,
    soldCount: 25,
    viewCount: 320
  },
  {
    name: 'Scented Candle',
    description: 'Natural scented candle with long-lasting fragrance',
    price: 799,
    category: 'Home Decor',
    mainImage: '/product_image/candle.jpg',
    images: ['/product_image/candle.jpg'],
    stock: 200,
    rating: 4.3,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 89,
    viewCount: 450
  },
  {
    name: 'Canvas Tote Bag',
    description: 'Eco-friendly canvas bag perfect for shopping and travel',
    price: 1599,
    category: 'Accessories',
    mainImage: '/product_image/canvasBag.jpg',
    images: ['/product_image/canvasBag.jpg'],
    stock: 40,
    rating: 4.6,
    reviews: [],
    featured: true,
    active: true,
    soldCount: 34,
    viewCount: 280
  },
  {
    name: 'Ceramic Vase',
    description: 'Beautiful hand-crafted ceramic vase for home decoration',
    price: 2899,
    category: 'Pottery',
    mainImage: '/product_image/ceramic.jpg',
    images: ['/product_image/ceramic.jpg', '/product_image/ceramic1.jpg'],
    stock: 25,
    rating: 4.8,
    reviews: [],
    featured: true,
    active: true,
    soldCount: 42,
    viewCount: 560
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt in various colors',
    price: 899,
    category: 'Accessories',
    mainImage: '/product_image/cottontshirt.jpg',
    images: ['/product_image/cottontshirt.jpg'],
    stock: 35,
    rating: 4.4,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 18,
    viewCount: 220
  },
  {
    name: 'Decorative Ball',
    description: 'Artistic decorative ball for home display',
    price: 1199,
    category: 'Home Decor',
    mainImage: '/product_image/decorativeball.jpg',
    images: ['/product_image/decorativeball.jpg'],
    stock: 45,
    rating: 4.7,
    reviews: [],
    featured: true,
    active: true,
    soldCount: 56,
    viewCount: 410
  },
  {
    name: 'Handmade Sweater',
    description: 'Cozy hand-knitted sweater with traditional patterns',
    price: 3499,
    category: 'Accessories',
    mainImage: '/product_image/handmadeSweater.jpg',
    images: ['/product_image/handmadeSweater.jpg'],
    stock: 100,
    rating: 4.2,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 67,
    viewCount: 310
  },
  {
    name: 'Jewelry Box',
    description: 'Elegant wooden jewelry box with velvet lining',
    price: 1799,
    category: 'Home Decor',
    mainImage: '/product_image/jewelrybox.jpg',
    images: ['/product_image/jewelrybox.jpg'],
    stock: 80,
    rating: 4.5,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 73,
    viewCount: 380
  },
  {
    name: 'Table Lamp',
    description: 'Modern table lamp with adjustable brightness',
    price: 2199,
    category: 'Home Decor',
    mainImage: '/product_image/lamp.jpg',
    images: ['/product_image/lamp.jpg'],
    stock: 55,
    rating: 4.6,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 41,
    viewCount: 270
  },
  {
    name: 'Leather Wallet',
    description: 'Premium genuine leather wallet with multiple card slots',
    price: 1899,
    category: 'Accessories',
    mainImage: '/product_image/leatherWallet.jpg',
    images: ['/product_image/leatherWallet.jpg'],
    stock: 60,
    rating: 4.7,
    reviews: [],
    featured: true,
    active: true,
    soldCount: 95,
    viewCount: 520
  },
  {
    name: 'Minimal Sneakers',
    description: 'Comfortable and stylish minimal sneakers',
    price: 4499,
    category: 'Accessories',
    mainImage: '/product_image/minimalSneakers.jpg',
    images: ['/product_image/minimalSneakers.jpg'],
    stock: 70,
    rating: 4.8,
    reviews: [],
    featured: true,
    active: true,
    soldCount: 128,
    viewCount: 680
  },
  {
    name: 'Artisan Notebook',
    description: 'Hand-bound notebook with handmade paper pages',
    price: 599,
    category: 'Other',
    mainImage: '/product_image/notebook.jpg',
    images: ['/product_image/notebook.jpg'],
    stock: 120,
    rating: 4.4,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 156,
    viewCount: 390
  },
  {
    name: 'Decorative Pillow',
    description: 'Hand-embroidered throw pillow with traditional patterns',
    price: 1499,
    category: 'Textiles',
    mainImage: '/product_image/pillow.jpg',
    images: ['/product_image/pillow.jpg'],
    stock: 85,
    rating: 4.6,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 102,
    viewCount: 445
  },
  {
    name: 'Clay Pot',
    description: 'Traditional handmade clay pot for cooking and storage',
    price: 899,
    category: 'Pottery',
    mainImage: '/product_image/pot.jpg',
    images: ['/product_image/pot.jpg'],
    stock: 65,
    rating: 4.5,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 78,
    viewCount: 310
  },
  {
    name: 'Wool Scarf',
    description: 'Premium wool scarf with intricate weave pattern',
    price: 1699,
    category: 'Textiles',
    mainImage: '/product_image/scarf.jpg',
    images: ['/product_image/scarf.jpg'],
    stock: 50,
    rating: 4.7,
    reviews: [],
    featured: true,
    active: true,
    soldCount: 67,
    viewCount: 445
  },
  {
    name: 'Classic Sneakers',
    description: 'Timeless classic sneakers for everyday wear',
    price: 3999,
    category: 'Accessories',
    mainImage: '/product_image/sneakers.jpg',
    images: ['/product_image/sneakers.jpg'],
    stock: 75,
    rating: 4.8,
    reviews: [],
    featured: true,
    active: true,
    soldCount: 145,
    viewCount: 720
  },
  {
    name: 'Cozy Socks',
    description: 'Comfortable and warm socks for all seasons',
    price: 399,
    category: 'Accessories',
    mainImage: '/product_image/socks.jpg',
    images: ['/product_image/socks.jpg'],
    stock: 200,
    rating: 4.3,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 234,
    viewCount: 580
  },
  {
    name: 'Wall Hanging',
    description: 'Beautiful textile wall hanging with geometric patterns',
    price: 2299,
    category: 'Art',
    mainImage: '/product_image/wallhanging.jpg',
    images: ['/product_image/wallhanging.jpg'],
    stock: 40,
    rating: 4.6,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 89,
    viewCount: 490
  },
  {
    name: 'Wooden Coasters',
    description: 'Set of 4 handcrafted wooden coasters with protective felt',
    price: 699,
    category: 'Home Decor',
    mainImage: '/product_image/woodenCoaster.jpg',
    images: ['/product_image/woodenCoaster.jpg'],
    stock: 110,
    rating: 4.5,
    reviews: [],
    featured: false,
    active: true,
    soldCount: 198,
    viewCount: 420
  }
];

async function seedDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} products`);

    console.log('\nSample Products:');
    inserted.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ₹${p.price}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
