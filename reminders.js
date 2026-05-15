const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route GET /api/reminders
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/reminders
router.put('/', protect, async (req, res) => {
  const { workoutReminder, waterReminder, mealReminder } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'settings.workoutReminder': workoutReminder, 'settings.waterReminder': waterReminder, 'settings.mealReminder': mealReminder },
      { new: true }
    ).select('settings');
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
