# 🛍️ HandMadeHeaven E-Commerce Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with real-time payment integration, admin dashboard, and comprehensive product management.

## ✨ Features

### Customer Features
- 🛒 **Shopping Cart** - Add, update, and remove items
- 💳 **Multiple Payment Methods** - Stripe, Razorpay, and COD
- 🔐 **User Authentication** - JWT-based secure login/signup
- 📦 **Order Tracking** - Real-time order status updates
- 💰 **Coupon System** - Apply discount codes at checkout
- ⭐ **Product Reviews** - Rate and review products
- 🎯 **Wishlist** - Save favorite products
- 📱 **Responsive Design** - Works on all devices

### Admin Features
- 📊 **Admin Dashboard** - Complete business analytics
- 📦 **Product Management** - CRUD operations for products
- 🏷️ **Coupon Management** - Create and manage discount codes
- 📋 **Order Management** - Update order status, track shipments
- 👥 **User Management** - View and manage customers
- 📈 **Analytics** - Sales reports, revenue tracking
- 🎨 **Settings** - Configure tax, shipping, discounts

### Payment Integration
- ✅ **Stripe** - International payments with 3D Secure
- ✅ **Razorpay** - Indian payment gateway
- ✅ **Real-time Validation** - Card validation as you type
- ✅ **Secure Processing** - PCI compliant payment handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ecommerce

# Install frontend dependencies
npm install --legacy-peer-deps

# Install backend dependencies
# Install backend dependencies
cd server
npm install
cd ..
```

### Configuration

#### 1. Backend Environment Variables
Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Razorpay (Optional)
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 2. Frontend Environment Variables
Create `.env.local` in root:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key
```

### Running the Application

```bash
# Terminal 1: Start Backend
cd server
npm start

# Terminal 2: Start Frontend
npm start
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000

## 📚 Documentation

- [Stripe Integration Guide](docs/STRIPE_REALTIME_INTEGRATION_GUIDE.md)
- [Testing Checklist](docs/STRIPE_TESTING_CHECKLIST.md)
- [Payment Setup](docs/PAYMENT_SETUP.md)
- [Admin Guide](docs/ADMIN_QUICK_START.md)

## 🧪 Testing

### Test Stripe Payment
```
Card: 4242 4242 4242 4242
Expiry: 12/34
CVV: 123
```

### Admin Login
```
Email: admin@example.com
Password: admin123
```

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- TailwindCSS
- Stripe.js
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Stripe & Razorpay APIs
- Cloudinary (Image hosting)

## 📁 Project Structure

```
ecommerce/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── context/        # Context providers
│   └── utils/          # Utility functions
├── server/
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & validation
│   └── server.js       # Express server
└── docs/               # Documentation
```

## 🔒 Security

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ MongoDB injection prevention
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Environment variable protection

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'build' folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables in hosting platform
# Deploy from 'server' folder
```

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**⭐ If you like this project, please give it a star!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
