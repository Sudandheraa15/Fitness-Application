const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Calculate BMI
const calcBMI = (weight, height) => {
  const h = height / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
};

// @route GET /api/progress
router.get('/', protect, async (req, res) => {
  try {
    const records = await Progress.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/progress/today
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let progress = await Progress.findOne({ user: req.user._id, date: { $gte: today } });
    if (!progress) {
      const user = await User.findById(req.user._id);
      progress = new Progress({
        user: req.user._id,
        weight: user.weight,
        bmi: calcBMI(user.weight, user.height)
      });
      await progress.save();
    }
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/progress/log
router.post('/log', protect, async (req, res) => {
  const { weight, waterIntake } = req.body;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let progress = await Progress.findOne({ user: req.user._id, date: { $gte: today } });
    if (!progress) progress = new Progress({ user: req.user._id });

    if (weight) {
      progress.weight = weight;
      progress.bmi = calcBMI(weight, req.user.height);
      // Update user's current weight
      await User.findByIdAndUpdate(req.user._id, { weight });
    }
    if (waterIntake !== undefined) progress.waterIntake = waterIntake;

    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route GET /api/progress/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const records = await Progress.find({ user: req.user._id }).sort({ date: 1 }).limit(30);
    const stats = {
      weightHistory: records.map(r => ({ date: r.date, weight: r.weight })),
      bmiHistory: records.map(r => ({ date: r.date, bmi: r.bmi })),
      caloriesHistory: records.map(r => ({ date: r.date, burned: r.caloriesBurned, consumed: r.caloriesConsumed })),
      workoutHistory: records.map(r => ({ date: r.date, count: r.workoutsCompleted })),
      totalWorkouts: records.reduce((sum, r) => sum + r.workoutsCompleted, 0),
      avgCaloriesBurned: records.length ? Math.round(records.reduce((s, r) => s + r.caloriesBurned, 0) / records.length) : 0
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
