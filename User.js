const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  height: { type: Number, required: true }, // cm
  weight: { type: Number, required: true }, // kg
  fitnessGoal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance'],
    required: true
  },
  healthConditions: { type: String, default: 'None' },
  settings: {
    darkMode: { type: Boolean, default: false },
    workoutReminder: { type: Boolean, default: true },
    waterReminder: { type: Boolean, default: true },
    mealReminder: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
