const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS Configuration (place before rate limiting so preflight gets headers)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(',');
const corsOptions = {
  origin: (origin, callback) => {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      return callback(null, true); // allow all origins in dev to avoid local CORS blocks
    }
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting DISABLED for development and testing
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/', limiter);

// // Stricter rate limiting for checkout and payment endpoints
// const checkoutLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 10, // limit each IP to 10 orders per minute
//   message: 'Too many checkout attempts, please wait before trying again.'
// });
// const paymentLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 20, // limit payment requests
//   message: 'Too many payment requests, please wait.'
// });
// app.use('/api/orders', checkoutLimiter);
// app.use('/api/payments', paymentLimiter);

// Compression for performance
app.use(compression());

// Request timeout middleware (30 seconds for most requests, 60 for heavy operations)
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  
  // Longer timeout for heavy operations
  if (req.path.includes('/dashboard') || req.path.includes('/analytics')) {
    req.setTimeout(60000); // 60 seconds
  }
  
  res.setTimeout(30000);
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Serve static files from frontend public folder
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection with optimizations for scalability
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
mongoose.connect(MONGO_URI, {
  maxPoolSize: 100,           // Maximum connection pool size
  minPoolSize: 10,            // Minimum connections to keep alive
  maxIdleTimeMS: 45000,       // Close idle connections after 45 seconds
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000,     // Socket timeout
  retryWrites: true          // Automatic retry on write failure
})
  .then(() => console.log('✅ MongoDB Connected with optimized pool'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin/images', require('./routes/adminImageUpload'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin/products', require('./routes/adminProducts'));
app.use('/api/admin/users', require('./routes/users'));
app.use('/api/admin', require('./routes/adminPanel'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/free-samples', require('./routes/freeSamples'));
app.use('/api/bulk-orders', require('./routes/bulkOrders'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/settings', require('./routes/publicSettings'));

// Health check (includes DB status)
app.get('/api/health', async (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const state = states[mongoose.connection.readyState] || 'unknown';
  let dbPing = null;
  try {
    dbPing = await mongoose.connection.db.admin().ping();
  } catch (e) {
    dbPing = { ok: 0, error: e.message };
  }
  res.json({ status: 'ok', dbState: state, dbPing });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
