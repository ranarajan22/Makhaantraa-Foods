const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const BulkOrder = require('./models/BulkOrder');
const FreeSample = require('./models/FreeSample');

const seedMakhanaDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out to keep old data)
    await Product.deleteMany({});
    await User.deleteMany({});
    await BulkOrder.deleteMany({});
    await FreeSample.deleteMany({});
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

    // Create test users
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
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
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

    // Create 7 Makhana Products
    const makhanaProducts = [
      {
        productId: '7-suta',
        name: '7 Suta Makhana',
        description: 'Largest pearls with exceptional crunch and color uniformity; ideal for luxury packs and hero SKUs.',
        price: 899,
        originalPrice: 1299,
        discount: 30,
        category: 'Makhana',
        mainImage: '/product_image/ceramic.jpg',
        images: ['/product_image/ceramic.jpg', '/product_image/ceramic1.jpg'],
        stock: 100,
        sku: 'MAKH-7SUTA-001',
        grade: 'Super Premium 16mm+',
        popRate: '99%+',
        moisture: '< 2.5%',
        moq: '50 kg',
        packaging: '200g / 1kg / 6kg / 7kg / 10kg',
        use: 'Flagship retail, gifting, export showcase',
        delivery: 'Ships in 2-3 days',
        featured: true,
        rating: 4.9,
        tags: ['premium', 'makhana', 'super-premium', 'luxury']
      },
      {
        productId: '6-suta',
        name: '6 Suta Makhana',
        description: 'Evenly graded premium pearls suited for top-shelf retail and consistent roasting output.',
        price: 749,
        originalPrice: 999,
        discount: 25,
        category: 'Makhana',
        mainImage: '/product_image/ceramic1.jpg',
        images: ['/product_image/ceramic1.jpg', '/product_image/ceramic.jpg'],
        stock: 150,
        sku: 'MAKH-6SUTA-001',
        grade: 'Premium 14-16mm',
        popRate: '98-99%',
        moisture: '< 3%',
        moq: '50 kg',
        packaging: '200g / 1kg / 6kg / 7kg / 10kg',
        use: 'Premium retail pouches and flavored roasting',
        delivery: 'Ships in 2-3 days',
        featured: true,
        rating: 4.8,
        tags: ['premium', 'makhana', 'retail', 'popular']
      },
      {
        productId: '5-suta',
        name: '5 Suta Makhana',
        description: 'Balanced size and yield for mainstream flavored lines and reliable roasting throughput.',
        price: 599,
        originalPrice: 849,
        discount: 29,
        category: 'Makhana',
        mainImage: '/product_image/notebook.jpg',
        images: ['/product_image/notebook.jpg', '/product_image/pillow.jpg'],
        stock: 200,
        sku: 'MAKH-5SUTA-001',
        grade: 'Standard 12-14mm',
        popRate: '97-98%',
        moisture: '< 3%',
        moq: '100 kg',
        packaging: '200g / 1kg / 6kg / 7kg / 10kg',
        use: 'Mainline retail, large-batch roasting',
        delivery: 'Ships in 2-3 days',
        featured: true,
        rating: 4.7,
        tags: ['standard', 'makhana', 'retail', 'mainstream']
      },
      {
        productId: '4-suta',
        name: '4 Suta Makhana',
        description: 'Cost-efficient lots for value SKUs, blending, and processed applications while maintaining clean color.',
        price: 449,
        originalPrice: 699,
        discount: 36,
        category: 'Makhana',
        mainImage: '/product_image/pillow.jpg',
        images: ['/product_image/pillow.jpg', '/product_image/pot.jpg'],
        stock: 250,
        sku: 'MAKH-4SUTA-001',
        grade: 'Value 10-12mm',
        popRate: '96-97%',
        moisture: '< 3%',
        moq: '200 kg',
        packaging: '1kg / 6kg / 7kg / 10kg',
        use: 'Value retail, blending, processing',
        delivery: 'Ships in 2-3 days',
        featured: false,
        rating: 4.5,
        tags: ['value', 'makhana', 'budget-friendly', 'bulk']
      },
      {
        productId: 'raw-makhana',
        name: 'Raw Makhana (Phool)',
        description: 'Cleaned raw fox nuts ready for custom grading, roasting, or private-label processing lines.',
        price: 349,
        originalPrice: 499,
        discount: 30,
        category: 'Makhana',
        mainImage: '/product_image/pot.jpg',
        images: ['/product_image/pot.jpg', '/product_image/pillow.jpg'],
        stock: 300,
        sku: 'MAKH-RAW-001',
        grade: 'Mixed size, cleaned',
        popRate: '96-98%',
        moisture: '< 3%',
        moq: '300 kg',
        packaging: '6kg / 7kg / 10kg',
        use: 'Further grading, custom processing',
        delivery: 'Ships in 3-5 days',
        featured: false,
        rating: 4.6,
        tags: ['raw', 'makhana', 'unprocessed', 'bulk']
      },
      {
        productId: 'roasted-makhana',
        name: 'Roasted Makhana',
        description: 'Lightly roasted, clean-label bases ready for flavoring or direct retail with nitrogen flushing.',
        price: 299,
        originalPrice: 449,
        discount: 33,
        category: 'Makhana',
        mainImage: '/product_image/decorativeball.jpg',
        images: ['/product_image/decorativeball.jpg', '/product_image/candle.jpg'],
        stock: 180,
        sku: 'MAKH-ROASTED-001',
        grade: 'Ready-to-eat',
        popRate: 'Roasted finished',
        moisture: 'Shelf-stable',
        moq: '100 kg',
        packaging: '200g / 1kg',
        delivery: 'Ships in 2-3 days',
        featured: true,
        rating: 4.7,
        tags: ['roasted', 'makhana', 'ready-to-eat', 'retail']
      },
      {
        productId: 'flavored-makhana',
        name: 'Flavored Makhana',
        description: 'Seasoned makhana bases (savory/sweet) ready for private label or modern trade distribution.',
        price: 399,
        originalPrice: 599,
        discount: 33,
        category: 'Makhana',
        mainImage: '/product_image/candle.jpg',
        images: ['/product_image/candle.jpg', '/product_image/decorativeball.jpg'],
        stock: 160,
        sku: 'MAKH-FLAVORED-001',
        grade: 'Seasoned, RTE',
        popRate: 'Roasted finished',
        moisture: 'Shelf-stable',
        moq: '100 kg',
        packaging: '200g / 1kg',
        use: 'Private label, D2C, modern trade',
        delivery: 'Ships in 2-3 days',
        featured: true,
        rating: 4.8,
        tags: ['flavored', 'makhana', 'ready-to-eat', 'seasoned']
      }
    ];

    const products = await Product.insertMany(makhanaProducts);
    console.log(`🛍️  Created ${products.length} Makhana products`);

    // Create sample bulk orders
    const bulkOrders = await BulkOrder.insertMany([
      {
        userId: users[0]._id,
        fullName: 'John Doe',
        company: 'ABC Traders',
        phone: '+91-9876543211',
        email: 'john@example.com',
        addressLine1: '456 Business Street',
        addressLine2: 'Commercial Zone',
        landmark: 'Near Station',
        city: 'Delhi',
        district: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        makhanaType: '6-suta',
        monthlyVolume: '100-500kg',
        packaging: '25kg',
        postSampleQty: 'above-100',
        notes: 'Need consistent supply for retail distribution',
        status: 'pending'
      },
      {
        userId: users[1]._id,
        fullName: 'Jane Smith',
        company: 'Global Exports',
        phone: '+91-9876543212',
        email: 'jane@example.com',
        addressLine1: '789 Export Lane',
        addressLine2: 'Industrial Area',
        landmark: 'Near Port',
        city: 'Mumbai',
        district: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        makhanaType: '7-suta',
        monthlyVolume: '500-1000kg',
        packaging: '50kg',
        postSampleQty: 'above-500',
        notes: 'Looking for premium grade for export',
        status: 'pending'
      }
    ]);
    console.log(`📦 Created ${bulkOrders.length} sample bulk orders`);

    // Create sample free sample requests
    const freeSamples = await FreeSample.insertMany([
      {
        userId: users[2]._id,
        name: 'Rajesh Kumar',
        company: 'Test Company',
        phone: '+91-9876543213',
        email: 'rajesh@example.com',
        addressLine1: '321 Sample Street',
        addressLine2: 'Test Area',
        landmark: 'Near Market',
        city: 'Bangalore',
        district: 'Bangalore',
        state: 'Karnataka',
        pincode: '560002',
        makhanaType: '5-suta',
        requirement: 'Product quality testing',
        message: 'Would like to test before bulk ordering',
        status: 'pending'
      }
    ]);
    console.log(`🎁 Created ${freeSamples.length} sample free sample requests`);

    console.log('\n✅ Makhana Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Admin users: 1 (admin@ecommerce.com / admin12345)`);
    console.log(`  - Regular users: ${users.length}`);
    console.log(`  - Makhana products: ${products.length}`);
    console.log(`  - Bulk orders: ${bulkOrders.length}`);
    console.log(`  - Free sample requests: ${freeSamples.length}`);
    console.log('\n🔍 Products (7 Makhana Types):');
    products.forEach(p => {
      console.log(`  ✓ ${p.name} (${p.productId}) - ₹${p.price}`);
    });
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedMakhanaDatabase();
