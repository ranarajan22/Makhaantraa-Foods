const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.subscribed) {
        return res.status(400).json({ error: 'Already subscribed' });
      }
      existing.subscribed = true;
      await existing.save();
      return res.json({ message: 'Resubscribed successfully' });
    }

    await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found' });
    }

    subscriber.subscribed = false;
    await subscriber.save();

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
