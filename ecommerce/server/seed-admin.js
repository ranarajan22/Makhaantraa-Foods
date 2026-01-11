const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function createDefaultAdmin() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@ecommerce.com' });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@ecommerce.com');
      console.log('🔑 Password: admin12345');
    } else {
      // Create default admin
      const admin = await User.create({
        name: 'Administrator',
        email: 'admin@ecommerce.com',
        password: 'admin12345', // Will be hashed automatically
        phone: '+91 9999999999',
        role: 'admin'
      });

      console.log('✅ Default admin user created successfully!');
      console.log('\n=== ADMIN CREDENTIALS ===');
      console.log('📧 Email: admin@ecommerce.com');
      console.log('🔑 Password: admin12345');
      console.log('========================\n');
      console.log('⚠️  Please change the password after first login!');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDefaultAdmin();
