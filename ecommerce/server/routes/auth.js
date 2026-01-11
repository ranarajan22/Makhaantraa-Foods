const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');
const crypto = require('crypto');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ error: 'Email already registered. Please login instead.' });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone: phone ? phone.trim() : '',
      verificationToken: crypto.randomBytes(32).toString('hex')
    });

    // Return user data with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const emailRaw = req.body.email || '';
    const passwordRaw = req.body.password || '';
    const email = emailRaw.trim();
    const password = passwordRaw.trim();

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@ecommerce.com').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'admin12345').trim();
    const loginEmail = email.toLowerCase();

    // Find user by email (any role)
    let user = await User.findOne({ email: loginEmail });
    const debug = { loginEmail, adminEmail, found: !!user, role: user?.role };

    // If a user exists with this email but is not admin, promote and reset password to default admin password
    if (user && user.role !== 'admin' && loginEmail === adminEmail) {
      user.role = 'admin';
      user.password = adminPassword;
      await user.save();
      debug.promoted = true;
    }

    // If no user, create default admin for the default admin email
    if (!user && loginEmail === adminEmail) {
      user = await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: adminPassword,
        phone: '+91 9999999999',
        role: 'admin'
      });
      debug.created = true;
    }

    // If still no user or not admin, reject
    if (!user || user.role !== 'admin') {
      console.warn('ADMIN_LOGIN_DEBUG', debug, 'reject:not-admin');
      return res.status(401).json({ error: 'Invalid admin credentials', code: 'ADMIN_AUTH_FAILED' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Check password; for default admin email, lock to default admin password and keep it in sync
    if (loginEmail === adminEmail) {
      const matchesDefault = await user.comparePassword(adminPassword);
      if (!matchesDefault) {
        user.password = adminPassword;
        await user.save();
        debug.resetToDefault = true;
      }

      const providedMatch = await user.comparePassword(password);
      if (!providedMatch) {
        console.warn('ADMIN_LOGIN_DEBUG', debug, 'reject:password-mismatch-default');
        return res.status(401).json({ error: 'Invalid admin credentials', code: 'ADMIN_AUTH_FAILED_DEFAULT' });
      }
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.warn('ADMIN_LOGIN_DEBUG', debug, 'reject:password-mismatch');
        return res.status(401).json({ error: 'Invalid admin credentials', code: 'ADMIN_AUTH_FAILED' });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('ADMIN_LOGIN_DEBUG', debug, 'success');

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile with addresses
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new address
router.post('/address', protect, async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    
    if (!street || !city || !state || !zipCode) {
      return res.status(400).json({ error: 'All address fields are required' });
    }

    const user = await User.findById(req.user._id);
    
    // If setting as default, unset all others
    if (isDefault) {
      user.address.forEach(addr => addr.isDefault = false);
    }

    user.address.push({
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
      isDefault: isDefault || user.address.length === 0
    });

    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update address
router.put('/address/:addressId', protect, async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    const address = user.address.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If setting as default, unset all others
    if (isDefault) {
      user.address.forEach(addr => addr.isDefault = false);
    }

    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete address
router.delete('/address/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.address.pull(req.params.addressId);
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // TODO: Send email with reset link
    res.json({ message: 'Password reset link sent to email', resetToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
