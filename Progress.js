const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number },
  bmi: { type: Number },
  caloriesBurned: { type: Number, default: 0 },
  caloriesConsumed: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 }, // glasses
  workoutsCompleted: { type: Number, default: 0 },
  workoutHistory: [
    {
      workoutId: String,
      workoutName: String,
      duration: Number,
      completedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Progress', ProgressSchema);
