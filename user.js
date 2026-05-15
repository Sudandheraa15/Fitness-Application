const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/user/profile
router.put('/profile', protect, async (req, res) => {
  const { name, age, gender, height, weight, fitnessGoal, healthConditions } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, age, gender, height, weight, fitnessGoal, healthConditions },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route PUT /api/user/settings
router.put('/settings', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { settings: req.body },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
