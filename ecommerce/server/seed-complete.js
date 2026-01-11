const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Coupon.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin12345', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: adminPassword,
      phone: '+91-9876543210',
      role: 'admin',
      emailVerified: true,
      address: [{
        street: '123 Business Street',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India',
        isDefault: true
      }]
    });
    console.log('👤 Admin user created:', admin.email);

    // Create regular users
    const userPassword = await bcrypt.hash('user12345', 12);
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        phone: '+91-9876543211',
        emailVerified: true,
        address: [{
          street: '456 User Lane',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India',
          isDefault: true
        }]
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: userPassword,
        phone: '+91-9876543212',
        emailVerified: true,
        address: [{
          street: '789 Customer Ave',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India',
          isDefault: true
        }]
      },
      {
        name: 'Michael Johnson',
        email: 'michael@example.com',
        password: userPassword,
        phone: '+91-9876543213',
        emailVerified: true,
        address: [{
          street: '321 Buyer Street',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560002',
          country: 'India',
          isDefault: true
        }]
      }
    ]);
    console.log(`👥 Created ${users.length} test users`);

    // Create products with reviews
    const productsData = [
      {
        name: 'Wooden Wall Art',
        description: 'Beautiful handcrafted wooden wall art piece featuring intricate designs and natural wood finish.',
        price: 2499,
        originalPrice: 3999,
        discount: 37,
        category: 'Home Decor',
        subCategory: 'Wall Art',
        mainImage: '/product_image/wallhanging.jpg',
        images: ['/product_image/wallhanging.jpg'],
        stock: 15,
        sku: 'WALL-ART-001',
        rating: 4.5,
        tags: ['wooden', 'wall art', 'handcrafted', 'decoration'],
        delivery: 'Ships in 3-5 days',
        featured: true,
        specifications: { material: 'Wood', dimensions: '60x40cm', weight: '2.5kg' }
      },
      {
        name: 'Silver Pendant Necklace',
        description: 'Elegant silver pendant necklace with semi-precious stone. Perfect for daily wear and special occasions.',
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        category: 'Jewelry',
        subCategory: 'Necklaces',
        mainImage: '/product_image/jewelrybox.jpg',
        images: ['/product_image/jewelrybox.jpg'],
        stock: 20,
        sku: 'JEWEL-NECK-001',
        rating: 4.8,
        tags: ['silver', 'necklace', 'jewelry', 'pendant'],
        delivery: 'Ships in 2-3 days',
        featured: true,
        specifications: { material: 'Silver', length: '45cm', weight: '5g' }
      },
      {
        name: 'Ceramic Decorative Vase',
        description: 'Hand-thrown ceramic vase with traditional patterns. Great for home decoration and flower arrangements.',
        price: 899,
        originalPrice: 1499,
        discount: 40,
        category: 'Pottery',
        subCategory: 'Vases',
        mainImage: '/product_image/ceramic.jpg',
        images: ['/product_image/ceramic.jpg', '/product_image/ceramic1.jpg'],
        stock: 10,
        sku: 'POTTERY-VASE-001',
        rating: 4.3,
        tags: ['ceramic', 'vase', 'pottery', 'decoration'],
        delivery: 'Ships in 4-6 days',
        featured: false,
        specifications: { material: 'Ceramic', height: '30cm', capacity: '2L' }
      },
      {
        name: 'Silk Printed Saree',
        description: 'Traditional silk saree with beautiful printed designs. Perfect for festivals and special occasions.',
        price: 3499,
        originalPrice: 5999,
        discount: 42,
        category: 'Textiles',
        subCategory: 'Sarees',
        mainImage: '/product_image/canvasBag.jpg',
        images: ['/product_image/canvasBag.jpg'],
        stock: 8,
        sku: 'TEXTILE-SAREE-001',
        rating: 4.6,
        tags: ['silk', 'saree', 'traditional', 'printed'],
        delivery: 'Ships in 2-3 days',
        featured: true,
        specifications: { material: 'Silk', length: '6m', weight: '500g' }
      },
      {
        name: 'Leather Crossbody Bag',
        description: 'Genuine leather crossbody bag with adjustable strap. Spacious and stylish for everyday use.',
        price: 1999,
        originalPrice: 3499,
        discount: 43,
        category: 'Accessories',
        subCategory: 'Bags',
        mainImage: '/product_image/leatherWallet.jpg',
        images: ['/product_image/leatherWallet.jpg'],
        stock: 12,
        sku: 'ACC-BAG-001',
        rating: 4.7,
        tags: ['leather', 'bag', 'crossbody', 'accessories'],
        delivery: 'Ships in 3-4 days',
        featured: false,
        specifications: { material: 'Leather', capacity: '5L', weight: '400g' }
      },
      {
        name: 'Handmade Terracotta Pot Set',
        description: 'Set of 3 handmade terracotta pots perfect for plants or decorative purposes. Eco-friendly.',
        price: 599,
        originalPrice: 999,
        discount: 40,
        category: 'Pottery',
        subCategory: 'Pots',
        mainImage: '/product_image/pot.jpg',
        images: ['/product_image/pot.jpg'],
        stock: 25,
        sku: 'POTTERY-POT-001',
        rating: 4.4,
        tags: ['terracotta', 'pot', 'handmade', 'eco-friendly'],
        delivery: 'Ships in 3-5 days',
        featured: false,
        specifications: { material: 'Terracotta', pieces: 3, sizes: 'S, M, L' }
      },
      {
        name: 'Gold Plated Earrings',
        description: 'Beautiful gold plated earrings with kundan work. Lightweight and comfortable for long wear.',
        price: 799,
        originalPrice: 1299,
        discount: 38,
        category: 'Jewelry',
        subCategory: 'Earrings',
        mainImage: '/product_image/bracelet.jpg',
        images: ['/product_image/bracelet.jpg'],
        stock: 30,
        sku: 'JEWEL-EAR-001',
        rating: 4.5,
        tags: ['gold', 'earrings', 'kundan', 'jewelry'],
        delivery: 'Ships in 2-3 days',
        featured: false,
        specifications: { material: 'Gold Plated', weight: '8g', type: 'Stud' }
      },
      {
        name: 'Abstract Canvas Art',
        description: 'Modern abstract canvas painting. Hand-painted by local artists. Unique and one-of-a-kind.',
        price: 4499,
        originalPrice: 7999,
        discount: 44,
        category: 'Art',
        subCategory: 'Paintings',
        mainImage: '/product_image/lamp.jpg',
        images: ['/product_image/lamp.jpg'],
        stock: 5,
        sku: 'ART-PAINT-001',
        rating: 4.9,
        tags: ['art', 'canvas', 'abstract', 'painting'],
        delivery: 'Ships in 5-7 days',
        featured: true,
        specifications: { material: 'Canvas', size: '80x100cm', type: 'Acrylic' }
      },
      {
        name: 'Brass Candle Stand',
        description: 'Vintage brass candle stand with intricate engravings. Perfect for home décor and ambiance.',
        price: 1599,
        originalPrice: 2699,
        discount: 41,
        category: 'Home Decor',
        subCategory: 'Lighting',
        mainImage: '/product_image/candle.jpg',
        images: ['/product_image/candle.jpg'],
        stock: 14,
        sku: 'DECOR-CANDLE-001',
        rating: 4.6,
        tags: ['brass', 'candle', 'vintage', 'lighting'],
        delivery: 'Ships in 3-4 days',
        featured: false,
        specifications: { material: 'Brass', height: '25cm', weight: '800g' }
      },
      {
        name: 'Cotton Printed Dress',
        description: 'Comfortable cotton printed dress suitable for all seasons. Machine washable and durable.',
        price: 1099,
        originalPrice: 1899,
        discount: 42,
        category: 'Textiles',
        subCategory: 'Dresses',
        mainImage: '/product_image/cottontshirt.jpg',
        images: ['/product_image/cottontshirt.jpg'],
        stock: 18,
        sku: 'TEXT-DRESS-001',
        rating: 4.4,
        tags: ['cotton', 'dress', 'printed', 'comfort'],
        delivery: 'Ships in 2-3 days',
        featured: false,
        specifications: { material: 'Cotton', sizes: 'XS-XXL', care: 'Machine wash' }
      },
      {
        name: 'Oxidized Silver Bangles Set',
        description: 'Set of 4 oxidized silver bangles with antique finish. Traditional and elegant design.',
        price: 1899,
        originalPrice: 3199,
        discount: 41,
        category: 'Jewelry',
        subCategory: 'Bangles',
        mainImage: '/product_image/scarf.jpg',
        images: ['/product_image/scarf.jpg'],
        stock: 16,
        sku: 'JEWEL-BANGLE-001',
        rating: 4.7,
        tags: ['silver', 'bangles', 'oxidized', 'traditional'],
        delivery: 'Ships in 2-3 days',
        featured: true,
        specifications: { material: 'Silver', pieces: 4, style: 'Antique' }
      },
      {
        name: 'Handwoven Carpet',
        description: 'Handwoven wool carpet with traditional patterns. Adds warmth and elegance to any room.',
        price: 5999,
        originalPrice: 9999,
        discount: 40,
        category: 'Textiles',
        subCategory: 'Carpets',
        mainImage: '/product_image/pillow.jpg',
        images: ['/product_image/pillow.jpg'],
        stock: 6,
        sku: 'TEXT-CARPET-001',
        rating: 4.8,
        tags: ['wool', 'carpet', 'handwoven', 'traditional'],
        delivery: 'Ships in 7-10 days',
        featured: true,
        specifications: { material: 'Wool', size: '5x8 feet', weight: '15kg' }
      },
      {
        name: 'Brass Incense Holder',
        description: 'Decorative brass incense holder with intricate designs. Enhance your space with natural fragrance.',
        price: 399,
        originalPrice: 699,
        discount: 43,
        category: 'Home Decor',
        subCategory: 'Decorative Items',
        mainImage: '/product_image/woodenCoaster.jpg',
        images: ['/product_image/woodenCoaster.jpg'],
        stock: 35,
        sku: 'DECOR-INCENSE-001',
        rating: 4.3,
        tags: ['brass', 'incense', 'decorative', 'home'],
        delivery: 'Ships in 2-3 days',
        featured: false,
        specifications: { material: 'Brass', capacity: '5 sticks', design: 'Carved' }
      },
      {
        name: 'Marble Decorative Figurine',
        description: 'Hand-carved marble figurine showcasing traditional craftsmanship. Perfect collectible piece.',
        price: 2199,
        originalPrice: 3999,
        discount: 45,
        category: 'Art',
        subCategory: 'Sculptures',
        mainImage: '/product_image/decorativeball.jpg',
        images: ['/product_image/decorativeball.jpg'],
        stock: 8,
        sku: 'ART-FIGURE-001',
        rating: 4.6,
        tags: ['marble', 'sculpture', 'figurine', 'art'],
        delivery: 'Ships in 5-7 days',
        featured: false,
        specifications: { material: 'Marble', height: '20cm', weight: '2kg' }
      },
      {
        name: 'Embroidered Cushion Cover',
        description: 'Beautiful embroidered cushion cover with traditional patterns. Adds comfort and style.',
        price: 599,
        originalPrice: 999,
        discount: 40,
        category: 'Accessories',
        subCategory: 'Home Furnishings',
        mainImage: '/product_image/bombooChoppingBoard.jpg',
        images: ['/product_image/bombooChoppingBoard.jpg'],
        stock: 22,
        sku: 'ACC-CUSHION-001',
        rating: 4.5,
        tags: ['embroidered', 'cushion', 'textile', 'home'],
        delivery: 'Ships in 2-4 days',
        featured: false,
        specifications: { material: 'Cotton', size: '40x40cm', care: 'Hand wash' }
      },
      {
        name: 'Glass Beaded Bracelet',
        description: 'Colorful glass beaded bracelet with adjustable string. Perfect for everyday wear and gifting.',
        price: 299,
        originalPrice: 599,
        discount: 50,
        category: 'Jewelry',
        subCategory: 'Bracelets',
        mainImage: '/product_image/socks.jpg',
        images: ['/product_image/socks.jpg'],
        stock: 40,
        sku: 'JEWEL-BRACE-001',
        rating: 4.2,
        tags: ['glass', 'beads', 'bracelet', 'jewelry'],
        delivery: 'Ships in 2-3 days',
        featured: false,
        specifications: { material: 'Glass Beads', adjustable: 'Yes', colors: 'Multi' }
      },
      {
        name: 'Wooden Jewelry Box',
        description: 'Carved wooden jewelry box with multiple compartments. Traditional design with modern functionality.',
        price: 1299,
        originalPrice: 2199,
        discount: 41,
        category: 'Accessories',
        subCategory: 'Storage',
        mainImage: '/product_image/notebook.jpg',
        images: ['/product_image/notebook.jpg'],
        stock: 11,
        sku: 'ACC-JEWELRY-BOX-001',
        rating: 4.4,
        tags: ['wooden', 'jewelry box', 'storage', 'carved'],
        delivery: 'Ships in 3-5 days',
        featured: false,
        specifications: { material: 'Wood', compartments: 6, size: 'Medium' }
      },
      {
        name: 'Silk Scarf',
        description: 'Premium silk scarf with vibrant colors. Versatile accessory for any season and occasion.',
        price: 899,
        originalPrice: 1499,
        discount: 40,
        category: 'Accessories',
        subCategory: 'Scarves',
        mainImage: '/product_image/minimalSneakers.jpg',
        images: ['/product_image/minimalSneakers.jpg'],
        stock: 20,
        sku: 'ACC-SCARF-001',
        rating: 4.5,
        tags: ['silk', 'scarf', 'accessories', 'vibrant'],
        delivery: 'Ships in 2-3 days',
        featured: false,
        specifications: { material: 'Silk', size: '100x100cm', care: 'Dry clean' }
      },
      {
        name: 'Traditional Bead Anklet',
        description: 'Traditional beaded anklet with authentic designs. Perfect for traditional occasions.',
        price: 399,
        originalPrice: 699,
        discount: 43,
        category: 'Jewelry',
        subCategory: 'Anklets',
        mainImage: '/product_image/handmadeSweater.jpg',
        images: ['/product_image/handmadeSweater.jpg'],
        stock: 28,
        sku: 'JEWEL-ANKLET-001',
        rating: 4.3,
        tags: ['beaded', 'anklet', 'traditional', 'jewelry'],
        delivery: 'Ships in 2-3 days',
        featured: false,
        specifications: { material: 'Beads', adjustable: 'Yes', style: 'Traditional' }
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log(`🛍️  Created ${products.length} products`);

    // Add reviews to products
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const numReviews = Math.floor(Math.random() * 4) + 1; // 1-4 reviews per product
      const reviews = [];

      for (let j = 0; j < numReviews; j++) {
        const user = users[j % users.length];
        reviews.push({
          user: user._id,
          userName: user.name,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          comment: `Great product! ${product.name} is exactly as described and excellent quality. Highly recommended!`,
          verified: true
        });
      }

      product.reviews = reviews;
      product.updateRating();
      await product.save();
    }
    console.log('⭐ Added reviews to products');

    // Create coupons
    const coupons = await Coupon.insertMany([
      {
        code: 'WELCOME10',
        description: '10% off on first purchase',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 500,
        maxDiscount: 500,
        active: true,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      },
      {
        code: 'FLAT50',
        description: 'Flat ₹50 off on orders above ₹1000',
        discountType: 'flat',
        discountValue: 50,
        minOrderValue: 1000,
        active: true,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
      },
      {
        code: 'SPECIAL20',
        description: '20% off on all items',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 0,
        active: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    ]);
    console.log(`🎁 Created ${coupons.length} coupons`);

    // Create sample orders
    const orders = await Order.insertMany([
      {
        user: users[0]._id,
        orderNumber: `ORD${Date.now()}001`,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
            image: products[0].mainImage
          },
          {
            product: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            image: products[1].mainImage
          }
        ],
        shippingAddress: {
          name: users[0].name,
          email: users[0].email,
          phone: users[0].phone,
          street: users[0].address[0].street,
          city: users[0].address[0].city,
          state: users[0].address[0].state,
          zipCode: users[0].address[0].zipCode,
          country: users[0].address[0].country
        },
        paymentMethod: 'Card',
        paymentStatus: 'Paid',
        itemsPrice: products[0].price + products[1].price,
        shippingPrice: 50,
        taxPrice: (products[0].price + products[1].price) * 0.18,
        totalPrice: products[0].price + products[1].price + 50 + ((products[0].price + products[1].price) * 0.18),
        status: 'Delivered',
        statusHistory: [
          { status: 'Processing', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
          { status: 'Shipped', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { status: 'Delivered', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
        ],
        trackingNumber: 'TRK1000001',
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[1]._id,
        orderNumber: `ORD${Date.now()}002`,
        items: [
          {
            product: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 2,
            image: products[2].mainImage
          }
        ],
        shippingAddress: {
          name: users[1].name,
          email: users[1].email,
          phone: users[1].phone,
          street: users[1].address[0].street,
          city: users[1].address[0].city,
          state: users[1].address[0].state,
          zipCode: users[1].address[0].zipCode,
          country: users[1].address[0].country
        },
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        itemsPrice: products[2].price * 2,
        shippingPrice: 50,
        taxPrice: (products[2].price * 2) * 0.18,
        totalPrice: (products[2].price * 2) + 50 + ((products[2].price * 2) * 0.18),
        status: 'Shipped',
        statusHistory: [
          { status: 'Processing', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { status: 'Shipped', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
        ],
        trackingNumber: 'TRK1000002'
      }
    ]);
    console.log(`📦 Created ${orders.length} sample orders`);

    // Update user cart and wishlist
    users[0].cart = [
      { product: products[3]._id, quantity: 1 },
      { product: products[4]._id, quantity: 2 }
    ];
    users[0].wishlist = [products[5]._id, products[6]._id];
    await users[0].save();

    users[1].wishlist = [products[7]._id, products[8]._id, products[9]._id];
    await users[1].save();

    console.log('🛒 Updated user carts and wishlists');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Admin users: 1 (admin@ecommerce.com / admin12345)`);
    console.log(`  - Regular users: ${users.length}`);
    console.log(`  - Products: ${products.length}`);
    console.log(`  - Orders: ${orders.length}`);
    console.log(`  - Coupons: ${coupons.length}`);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
