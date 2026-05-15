# 🏋️ FitLife - Full-Stack Fitness Application

A complete fitness companion for students and beginners. Track workouts, follow personalized diet plans, monitor progress, and stay motivated — all in one place.

---

## ✨ Features

| Module | Description |
|---|---|
| **Authentication** | Register/Login with JWT. Collects name, age, gender, height, weight, fitness goal, health conditions |
| **Dashboard** | Daily stats (calories, workouts, water), BMI, quick actions, profile summary |
| **Workouts** | Beginner / Intermediate / Advanced exercises with instructions, duration, calories |
| **Diet Plan** | Goal-based meal plans (breakfast, lunch, dinner, snacks) with macros |
| **Progress** | Log weight & water, view charts for weight, BMI, calories, workouts |
| **Reminders** | Toggle workout, water, and meal reminders. Daily schedule view |
| **Profile** | View and edit all personal details and fitness goals |
| **Settings** | Dark mode / Light mode toggle, logout |

---

## 🗂️ Project Structure

```
fitness-app/
├── server.js              # Express app entry point
├── .env                   # Environment variables
├── package.json
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js            # User schema (profile + settings)
│   └── Progress.js        # Daily progress schema
├── routes/
│   ├── auth.js            # POST /api/auth/register, /login
│   ├── user.js            # GET/PUT /api/user/profile, /settings
│   ├── workouts.js        # GET /api/workouts/:level, POST /complete
│   ├── diet.js            # GET /api/diet/plan, POST /log
│   ├── progress.js        # GET/POST /api/progress, /today, /stats
│   └── reminders.js       # GET/PUT /api/reminders
└── frontend/
    ├── index.html         # Single-page application
    ├── css/
    │   └── style.css      # Full responsive stylesheet
    └── js/
        ├── api.js         # API helper functions
        └── app.js         # App logic, navigation, UI rendering
```

---

## 🚀 Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Step 1 — Clone / Navigate to the project

```bash
cd fitness-app
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure environment variables

Edit `.env` (already created):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fitnessapp
JWT_SECRET=fitness_app_super_secret_key_2024
JWT_EXPIRE=7d
```

> For MongoDB Atlas, replace `MONGO_URI` with your connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/fitnessapp`

### Step 4 — Start the server

**Development (auto-restart on changes):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### Step 5 — Open the app

Visit: **http://localhost:5000**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### User
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/profile` | Update profile details |
| PUT | `/api/user/settings` | Update app settings |

### Workouts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workouts` | Get all workouts |
| GET | `/api/workouts/:level` | Get by level (beginner/intermediate/advanced) |
| POST | `/api/workouts/complete` | Mark workout as completed |

### Diet
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/diet/plan` | Get meal plan for user's goal |
| POST | `/api/diet/log` | Log calories consumed |

### Progress
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/progress` | Get last 30 days of records |
| GET | `/api/progress/today` | Get or create today's record |
| POST | `/api/progress/log` | Log weight / water intake |
| GET | `/api/progress/stats` | Get chart data (weight, BMI, calories, workouts) |

### Reminders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reminders` | Get reminder settings |
| PUT | `/api/reminders` | Update reminder toggles |

---

## 🗄️ Database Schema

### User
```js
{
  name, email, password (hashed),
  age, gender, height (cm), weight (kg),
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintenance',
  healthConditions,
  settings: { darkMode, workoutReminder, waterReminder, mealReminder }
}
```

### Progress
```js
{
  user (ref),
  date,
  weight, bmi,
  caloriesBurned, caloriesConsumed,
  waterIntake (glasses),
  workoutsCompleted,
  workoutHistory: [{ workoutId, workoutName, duration, completedAt }]
}
```

---

## 🎨 UI Highlights

- Background images from [Unsplash](https://unsplash.com) (no API key needed)
- Dark/Light mode with CSS variables
- Fully responsive — works on mobile, tablet, desktop
- Chart.js for progress visualization
- Font Awesome icons throughout
- Toast notifications for all actions
- Smooth animations and hover effects

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Charts | Chart.js (CDN) |
| Icons | Font Awesome 6 (CDN) |

---

## 📝 Notes

- All API routes (except auth) require `Authorization: Bearer <token>` header
- Workout data is static (no DB needed for workouts)
- Diet plans are generated based on the user's `fitnessGoal`
- Progress records are created per day — one record per user per day
- Dark mode preference is saved to the database and restored on login
