const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');

// Static workout data categorized by level
const workouts = {
  beginner: [
    { id: 'b1', name: 'Morning Walk', category: 'Cardio', duration: 30, calories: 150,
      image: 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Walk at a moderate pace for 30 minutes. Keep your back straight and arms swinging naturally.', sets: null, reps: null },
    { id: 'b2', name: 'Basic Squats', category: 'Strength', duration: 15, calories: 80,
      image: 'https://images.pexels.com/photos/4608089/pexels-photo-4608089.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Stand with feet shoulder-width apart. Lower your body as if sitting in a chair. Keep knees behind toes. Do 3 sets of 10 reps.', sets: 3, reps: 10 },
    { id: 'b3', name: 'Wall Push-ups', category: 'Strength', duration: 10, calories: 50,
      image: 'https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Stand arm\'s length from wall. Place palms flat on wall. Bend elbows to bring chest toward wall. Push back. Do 3 sets of 10.', sets: 3, reps: 10 },
    { id: 'b4', name: 'Seated Leg Raises', category: 'Core', duration: 10, calories: 40,
      image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Sit on a chair. Straighten one leg and hold for 2 seconds. Lower slowly. Alternate legs. 3 sets of 10 each.', sets: 3, reps: 10 },
    { id: 'b5', name: 'Stretching Routine', category: 'Flexibility', duration: 20, calories: 60,
      image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Full body stretch: neck rolls, shoulder stretch, hamstring stretch, quad stretch. Hold each for 30 seconds.', sets: null, reps: null }
  ],
  intermediate: [
    { id: 'i1', name: 'Jogging', category: 'Cardio', duration: 30, calories: 300,
      image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Jog at a comfortable pace. Maintain steady breathing. Aim for 30 minutes without stopping.', sets: null, reps: null },
    { id: 'i2', name: 'Push-ups', category: 'Strength', duration: 15, calories: 100,
      image: 'https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Standard push-up position. Lower chest to floor, push back up. Keep core tight. 4 sets of 15 reps.', sets: 4, reps: 15 },
    { id: 'i3', name: 'Lunges', category: 'Strength', duration: 15, calories: 120,
      image: 'https://images.pexels.com/photos/4498574/pexels-photo-4498574.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Step forward with one leg, lower hips until both knees at 90°. Push back to start. Alternate legs. 3 sets of 12 each.', sets: 3, reps: 12 },
    { id: 'i4', name: 'Plank', category: 'Core', duration: 10, calories: 60,
      image: 'https://images.pexels.com/photos/6456301/pexels-photo-6456301.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Hold push-up position on forearms. Keep body straight. Hold for 30-60 seconds. 3 sets.', sets: 3, reps: null },
    { id: 'i5', name: 'Bicycle Crunches', category: 'Core', duration: 15, calories: 90,
      image: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Lie on back, hands behind head. Bring opposite elbow to knee while extending other leg. 3 sets of 20.', sets: 3, reps: 20 }
  ],
  advanced: [
    { id: 'a1', name: 'HIIT Cardio', category: 'Cardio', duration: 30, calories: 450,
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: '20 sec sprint, 10 sec rest. Repeat 8 rounds. Include: burpees, jump squats, mountain climbers, high knees.', sets: 8, reps: null },
    { id: 'a2', name: 'Pull-ups', category: 'Strength', duration: 20, calories: 150,
      image: 'https://images.pexels.com/photos/4608089/pexels-photo-4608089.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Hang from bar with overhand grip. Pull body up until chin clears bar. Lower slowly. 4 sets of 8-12 reps.', sets: 4, reps: 10 },
    { id: 'a3', name: 'Burpees', category: 'FullBody', duration: 20, calories: 200,
      image: 'https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'From standing, drop to squat, kick feet back to push-up, do push-up, jump feet forward, jump up with arms overhead. 4 sets of 15.', sets: 4, reps: 15 },
    { id: 'a4', name: 'Deadlifts', category: 'Strength', duration: 25, calories: 180,
      image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Stand with feet hip-width. Hinge at hips, grip bar. Keep back flat, drive through heels to stand. 4 sets of 8 reps.', sets: 4, reps: 8 },
    { id: 'a5', name: 'Box Jumps', category: 'Plyometric', duration: 20, calories: 220,
      image: 'https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Stand before box. Bend knees, swing arms, jump onto box landing softly. Step down. 4 sets of 10 reps.', sets: 4, reps: 10 }
  ]
};

// @route GET /api/workouts
router.get('/', protect, (req, res) => {
  res.json(workouts);
});

// @route GET /api/workouts/:level
router.get('/:level', protect, (req, res) => {
  const level = req.params.level;
  if (!workouts[level]) return res.status(404).json({ message: 'Level not found' });
  res.json(workouts[level]);
});

// @route POST /api/workouts/complete
router.post('/complete', protect, async (req, res) => {
  const { workoutId, workoutName, duration, caloriesBurned } = req.body;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let progress = await Progress.findOne({ user: req.user._id, date: { $gte: today } });
    if (!progress) {
      progress = new Progress({ user: req.user._id });
    }

    progress.workoutsCompleted += 1;
    progress.caloriesBurned += caloriesBurned || 0;
    progress.workoutHistory.push({ workoutId, workoutName, duration });

    await progress.save();
    res.json({ message: 'Workout marked as completed', progress });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
