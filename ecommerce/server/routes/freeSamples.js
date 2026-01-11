const express = require('express');
const router = express.Router();
const FreeSample = require('../models/FreeSample');
const { protect } = require('../middleware/auth');

// Submit free sample request (optional auth)
router.post('/submit', async (req, res) => {
  try {
    const {
      name,
      company,
      phone,
      email,
      addressLine1,
      addressLine2,
      landmark,
      city,
      district,
      state,
      pincode,
      makhanaType,
      requirement,
      message
    } = req.body;

    // Validate required fields (trim and check for empty strings)
    const requiredFields = {
      name,
      phone,
      email,
      addressLine1,
      city,
      district,
      state,
      pincode,
      makhanaType
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (typeof value === 'string' && !value.trim()))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Validate phone (basic check - at least 10 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({ error: 'Phone number must have at least 10 digits' });
    }

    // Validate PIN code (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ error: 'PIN code must be exactly 6 digits' });
    }

    const sampleData = {
      name: name.trim(),
      company: (company || '').trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      addressLine1: addressLine1.trim(),
      addressLine2: (addressLine2 || '').trim(),
      landmark: (landmark || '').trim(),
      city: city.trim(),
      district: district.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      makhanaType: makhanaType.trim(),
      requirement: (requirement || '').trim(),
      message: (message || '').trim(),
      status: 'Pending'
    };

    // Add userId if user is logged in (from authorization header)
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        sampleData.userId = decoded._id;
      } catch (err) {
        // Token invalid or expired - continue without userId
      }
    }

    const sample = new FreeSample(sampleData);
    await sample.save();

    res.status(201).json({ 
      success: true,
      message: 'Free sample request submitted successfully!',
      orderId: sample.orderId,
      requestId: sample._id 
    });
  } catch (error) {
    console.error('Free sample submission error:', error);
    
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    res.status(500).json({ error: error.message || 'Failed to submit request. Please try again.' });
  }
});

// Get user's free sample requests (authenticated)
router.get('/my', protect, async (req, res) => {
  try {
    const samples = await FreeSample.find({ 
      $or: [
        { userId: req.user._id },
        { email: req.user.email }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(samples);
  } catch (error) {
    console.error('Error fetching user free samples:', error);
    res.status(500).json({ error: 'Failed to fetch free sample requests' });
  }
});

module.exports = router;
