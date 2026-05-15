const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');

// ===== INDIAN MEAL PLANS =====
// All ingredients in grams/ml. Each meal has a food image from Unsplash.
const mealPlans = {

  // ─────────────────────────────────────────────
  // WEIGHT LOSS  ~1500 kcal/day
  // ─────────────────────────────────────────────
  weight_loss: {
    calories: 1500,
    meals: {
      breakfast: [
        {
          name: 'Moong Dal Chilla',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 220, protein: 14, carbs: 28, fat: 5,
          ingredients: ['150g moong dal (soaked & ground)', '30g onion (finely chopped)', '20g tomato (chopped)', '10g green chilli', '5g ginger (grated)', '2g cumin seeds', '2g turmeric', '5ml oil', 'salt to taste']
        },
        {
          name: 'Oats Upma',
          image: 'https://images.pexels.com/photos/6260921/pexels-photo-6260921.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 240, protein: 8, carbs: 38, fat: 6,
          ingredients: ['80g rolled oats', '30g onion (chopped)', '20g carrot (grated)', '20g green peas', '10g green chilli', '5ml oil', '2g mustard seeds', '2g curry leaves', 'salt to taste', '200ml water']
        },
        {
          name: 'Besan Cheela with Curd',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 260, protein: 16, carbs: 30, fat: 7,
          ingredients: ['100g besan (gram flour)', '30g spinach (chopped)', '20g onion', '10g green chilli', '5g ajwain', '5ml oil', '100g low-fat curd', 'salt & pepper to taste']
        }
      ],
      lunch: [
        {
          name: 'Dal Khichdi with Raita',
          image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 380, protein: 18, carbs: 58, fat: 8,
          ingredients: ['80g brown rice', '60g moong dal', '30g onion', '20g tomato', '10g ginger-garlic paste', '5g turmeric', '5g cumin', '5ml ghee', '100g low-fat curd (for raita)', '20g cucumber', 'salt to taste']
        },
        {
          name: 'Palak Paneer with Roti',
          image: 'https://images.pexels.com/photos/9609847/pexels-photo-9609847.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 420, protein: 22, carbs: 45, fat: 14,
          ingredients: ['150g spinach (blanched)', '80g low-fat paneer', '30g onion', '20g tomato', '10g ginger-garlic paste', '5g garam masala', '5ml oil', '2 whole wheat rotis (60g each)']
        },
        {
          name: 'Rajma Chawal (Light)',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 400, protein: 20, carbs: 62, fat: 7,
          ingredients: ['80g brown rice', '100g rajma (kidney beans, boiled)', '30g onion', '20g tomato puree', '10g ginger-garlic paste', '5g coriander powder', '5g cumin', '5ml oil', 'salt to taste']
        }
      ],
      dinner: [
        {
          name: 'Grilled Tandoori Chicken with Salad',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 350, protein: 40, carbs: 12, fat: 12,
          ingredients: ['200g chicken breast', '50g low-fat curd', '10g tandoori masala', '5g lemon juice', '5g ginger-garlic paste', '50g onion rings', '50g cucumber', '30g tomato', 'mint chutney']
        },
        {
          name: 'Vegetable Daliya',
          image: 'https://images.pexels.com/photos/6260921/pexels-photo-6260921.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 300, protein: 12, carbs: 48, fat: 6,
          ingredients: ['80g broken wheat (daliya)', '30g carrot (diced)', '30g beans (chopped)', '20g peas', '20g onion', '10g ginger', '5g turmeric', '5ml oil', '2g mustard seeds', 'salt to taste']
        },
        {
          name: 'Masoor Dal Soup with Roti',
          image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 320, protein: 18, carbs: 50, fat: 6,
          ingredients: ['80g masoor dal', '30g tomato', '20g onion', '10g garlic', '5g cumin', '5g turmeric', '5ml oil', '1 whole wheat roti (60g)', 'salt & lemon to taste']
        }
      ],
      snacks: [
        {
          name: 'Roasted Chana & Murmura',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 150, protein: 8, carbs: 22, fat: 3,
          ingredients: ['40g roasted chana', '20g murmura (puffed rice)', '10g onion (chopped)', '5g green chilli', '5ml lemon juice', 'chaat masala to taste']
        },
        {
          name: 'Sprouts Chaat',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 130, protein: 9, carbs: 20, fat: 2,
          ingredients: ['80g mixed sprouts (moong, chana)', '20g tomato (chopped)', '15g onion', '5g green chilli', '5ml lemon juice', 'chaat masala & coriander']
        },
        {
          name: 'Buttermilk (Chaas)',
          image: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 80, protein: 4, carbs: 8, fat: 2,
          ingredients: ['200ml low-fat curd', '150ml water', '5g roasted cumin powder', '5g ginger (grated)', 'salt & mint leaves to taste']
        }
      ]
    }
  },

  // ─────────────────────────────────────────────
  // MUSCLE GAIN  ~2800 kcal/day
  // ─────────────────────────────────────────────
  muscle_gain: {
    calories: 2800,
    meals: {
      breakfast: [
        {
          name: 'Egg Bhurji with Paratha',
          image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 520, protein: 32, carbs: 52, fat: 18,
          ingredients: ['4 whole eggs', '30g onion (chopped)', '20g tomato', '10g green chilli', '5g turmeric', '5g garam masala', '10ml oil', '2 whole wheat parathas (80g each)', 'coriander leaves']
        },
        {
          name: 'Paneer Paratha with Curd',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 580, protein: 28, carbs: 65, fat: 20,
          ingredients: ['160g whole wheat flour', '120g paneer (crumbled)', '20g onion', '10g green chilli', '5g ajwain', '10ml ghee', '150g full-fat curd', 'salt & coriander']
        },
        {
          name: 'Masala Oats with Boiled Eggs',
          image: 'https://images.pexels.com/photos/6260921/pexels-photo-6260921.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 490, protein: 30, carbs: 55, fat: 14,
          ingredients: ['100g rolled oats', '3 boiled eggs', '30g onion', '20g tomato', '20g carrot (grated)', '10g green chilli', '5ml oil', '2g mustard seeds', '200ml milk', 'salt to taste']
        }
      ],
      lunch: [
        {
          name: 'Chicken Curry with Brown Rice',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 680, protein: 52, carbs: 72, fat: 18,
          ingredients: ['250g chicken (bone-in)', '150g brown rice', '50g onion', '40g tomato', '15g ginger-garlic paste', '10g coriander powder', '5g garam masala', '5g turmeric', '10ml oil', 'coriander leaves']
        },
        {
          name: 'Chole with Bhature',
          image: 'https://images.pexels.com/photos/9609847/pexels-photo-9609847.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 720, protein: 28, carbs: 95, fat: 22,
          ingredients: ['150g kabuli chana (boiled)', '2 bhature (100g each, maida)', '50g onion', '40g tomato', '15g ginger-garlic paste', '10g chole masala', '10ml oil', 'pickle & onion rings']
        },
        {
          name: 'Mutton Keema with Roti',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 700, protein: 48, carbs: 55, fat: 24,
          ingredients: ['200g mutton keema', '3 whole wheat rotis (60g each)', '50g onion', '40g tomato', '15g ginger-garlic paste', '10g keema masala', '30g green peas', '10ml oil', 'coriander & mint']
        }
      ],
      dinner: [
        {
          name: 'Fish Curry with Rice',
          image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 620, protein: 48, carbs: 65, fat: 16,
          ingredients: ['250g rohu/catla fish', '150g basmati rice', '50g onion', '40g tomato', '15g ginger-garlic paste', '10g fish masala', '5g turmeric', '10ml mustard oil', 'curry leaves & coriander']
        },
        {
          name: 'Dal Makhani with Naan',
          image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 650, protein: 30, carbs: 85, fat: 20,
          ingredients: ['100g whole urad dal', '30g rajma', '2 naan (80g each)', '50g butter', '40g cream', '40g tomato puree', '20g onion', '10g ginger-garlic paste', '5g garam masala']
        },
        {
          name: 'Paneer Tikka Masala with Roti',
          image: 'https://images.pexels.com/photos/9609847/pexels-photo-9609847.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 600, protein: 35, carbs: 58, fat: 22,
          ingredients: ['200g paneer (cubed)', '3 whole wheat rotis (60g each)', '50g onion', '40g capsicum', '40g tomato puree', '50g curd', '10g tikka masala', '10ml oil', 'kasuri methi']
        }
      ],
      snacks: [
        {
          name: 'Peanut Chikki & Banana',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 320, protein: 10, carbs: 48, fat: 12,
          ingredients: ['50g peanut chikki (jaggery & peanuts)', '1 medium banana (120g)', '200ml full-fat milk']
        },
        {
          name: 'Paneer Bhurji Sandwich',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 380, protein: 22, carbs: 42, fat: 14,
          ingredients: ['100g paneer (crumbled)', '2 whole wheat bread slices (60g each)', '20g onion', '15g capsicum', '5g green chilli', '5ml oil', '5g chaat masala', 'coriander leaves']
        },
        {
          name: 'Dry Fruit Ladoo',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 280, protein: 8, carbs: 32, fat: 14,
          ingredients: ['30g almonds', '20g cashews', '20g dates (pitted)', '15g desiccated coconut', '10g jaggery', '5g cardamom powder']
        }
      ]
    }
  },

  // ─────────────────────────────────────────────
  // MAINTENANCE  ~2000 kcal/day
  // ─────────────────────────────────────────────
  maintenance: {
    calories: 2000,
    meals: {
      breakfast: [
        {
          name: 'Idli Sambar with Coconut Chutney',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 360, protein: 14, carbs: 62, fat: 8,
          ingredients: ['4 idlis (200g rice-urad batter)', '150ml sambar (toor dal, vegetables)', '30g coconut chutney', '20g onion', '10g tomato', '5g mustard seeds', '5ml oil', 'curry leaves']
        },
        {
          name: 'Poha with Peanuts',
          image: 'https://images.pexels.com/photos/6260921/pexels-photo-6260921.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 340, protein: 10, carbs: 55, fat: 9,
          ingredients: ['100g flattened rice (poha)', '30g roasted peanuts', '30g onion (chopped)', '20g potato (diced)', '10g green chilli', '5ml oil', '5g turmeric', '5g mustard seeds', 'curry leaves & lemon juice']
        },
        {
          name: 'Dosa with Sambar',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 380, protein: 12, carbs: 65, fat: 9,
          ingredients: ['2 dosas (150g batter each)', '150ml sambar', '30g coconut chutney', '5ml oil', 'curry leaves & coriander']
        }
      ],
      lunch: [
        {
          name: 'Aloo Gobi Sabzi with Dal & Roti',
          image: 'https://images.pexels.com/photos/9609847/pexels-photo-9609847.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 480, protein: 18, carbs: 72, fat: 12,
          ingredients: ['150g potato (cubed)', '150g cauliflower', '80g toor dal', '3 whole wheat rotis (60g each)', '30g onion', '20g tomato', '10g ginger-garlic paste', '5g coriander powder', '5g turmeric', '8ml oil']
        },
        {
          name: 'Biryani (Veg) with Raita',
          image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 520, protein: 16, carbs: 82, fat: 14,
          ingredients: ['150g basmati rice', '100g mixed vegetables (carrot, beans, peas)', '30g onion (fried)', '20g curd', '10g biryani masala', '5g saffron (soaked in 30ml milk)', '10ml ghee', '100g raita']
        },
        {
          name: 'Sambar Rice with Papad',
          image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 460, protein: 16, carbs: 75, fat: 10,
          ingredients: ['150g cooked rice', '150ml sambar (toor dal, drumstick, tomato)', '1 papad (roasted)', '10ml ghee', '5g mustard seeds', 'curry leaves & coriander']
        }
      ],
      dinner: [
        {
          name: 'Roti with Mixed Veg Curry & Dal',
          image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 480, protein: 20, carbs: 68, fat: 12,
          ingredients: ['3 whole wheat rotis (60g each)', '100g mixed vegetables', '80g moong dal', '30g onion', '20g tomato', '10g ginger-garlic paste', '5g garam masala', '8ml oil', 'coriander leaves']
        },
        {
          name: 'Egg Curry with Rice',
          image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 500, protein: 28, carbs: 58, fat: 16,
          ingredients: ['3 boiled eggs', '150g basmati rice', '50g onion', '40g tomato', '15g ginger-garlic paste', '10g egg curry masala', '5g turmeric', '10ml oil', 'coriander & green chilli']
        },
        {
          name: 'Kadhi Pakora with Rice',
          image: 'https://images.pexels.com/photos/9609847/pexels-photo-9609847.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 460, protein: 14, carbs: 70, fat: 14,
          ingredients: ['150g curd (for kadhi)', '30g besan', '150g basmati rice', '30g onion pakoras (besan-fried)', '5g turmeric', '5g red chilli', '5ml ghee', '2g mustard seeds', 'curry leaves']
        }
      ],
      snacks: [
        {
          name: 'Samosa (Baked) with Chutney',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 200, protein: 5, carbs: 30, fat: 7,
          ingredients: ['2 baked samosas (60g each, whole wheat)', '30g green chutney (mint-coriander)', '20g tamarind chutney', '10g onion (chopped)']
        },
        {
          name: 'Makhana (Fox Nuts) Roasted',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 160, protein: 5, carbs: 28, fat: 4,
          ingredients: ['40g makhana (fox nuts)', '5ml ghee', '5g rock salt', '3g black pepper', '3g chaat masala']
        },
        {
          name: 'Lassi (Sweet)',
          image: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=600',
          calories: 180, protein: 7, carbs: 28, fat: 5,
          ingredients: ['200g full-fat curd', '150ml chilled water', '20g sugar', '5g cardamom powder', 'rose water (optional)', 'ice cubes']
        }
      ]
    }
  }
};

// @route GET /api/diet/plan
router.get('/plan', protect, (req, res) => {
  const goal = req.user.fitnessGoal;
  const plan = mealPlans[goal] || mealPlans['maintenance'];
  res.json(plan);
});

// @route POST /api/diet/log
router.post('/log', protect, async (req, res) => {
  const { calories } = req.body;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let progress = await Progress.findOne({ user: req.user._id, date: { $gte: today } });
    if (!progress) progress = new Progress({ user: req.user._id });
    progress.caloriesConsumed += calories || 0;
    await progress.save();
    res.json({ message: 'Meal logged', progress });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


