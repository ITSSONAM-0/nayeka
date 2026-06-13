# Volunteer Information Management System (VIMS) - NayePankh Foundation

A full-stack, responsive web application designed for the NGO **NayePankh Foundation** to manage volunteer databases, contact details, skill sets, availability profiles, and participation history.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite) + Tailwind CSS v3 + Lucide Icons + React Router v6
- **Backend**: Node.js + Express.js (ES Modules, JWT authentication, Bcrypt password hashing)
- **Database**: MongoDB (via Mongoose ODM)
- **Tooling**: Concurrently (run client & server in a single command)

---

## 📁 Project Structure

```text
nayepankh-vims/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection config
│   ├── controllers/
│   │   ├── authController.js      # Register & Login controllers
│   │   └── volunteerController.js # Volunteer CRUD, search, pagination & stats
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & admin route guards
│   ├── models/
│   │   └── Volunteer.js          # MongoDB Schema for volunteers
│   ├── routes/
│   │   ├── authRoutes.js         # Routes for signin/signup
│   │   └── volunteerRoutes.js    # Protected CRUD & Stats routes
│   ├── utils/
│   │   └── generateToken.js      # JWT generation helper
│   ├── .env                      # Active local environment variables
│   ├── .env.example              # Variables template
│   ├── seed.js                   # Database seeding script
│   └── server.js                 # App entry point & admin auto-creator
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx     # Admin control panel (stats, CSV, CRUD list)
│   │   │   ├── EditVolunteerModal.jsx # Admin popup to modify details & history
│   │   │   ├── Navbar.jsx             # Adaptive navigation bar with role badges
│   │   │   ├── ProtectedRoute.jsx     # Route guarding wrapper
│   │   │   ├── Toast.jsx              # Lightweight custom feedback notifications
│   │   │   └── VolunteerDashboard.jsx # Volunteer portal (profile & history timeline)
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Session management & automatic JWT injection
│   │   ├── pages/
│   │   │   ├── Login.jsx              # Custom validated login screen
│   │   │   └── Register.jsx           # Volunteer signup screen with skills badges
│   │   ├── App.jsx                    # Route mapping
│   │   ├── index.css                  # Tailwinds directives & glassmorphism
│   │   └── main.jsx                   # React root mount
│   ├── index.html                     # HTML core (Outfit font loader & meta tags)
│   ├── tailwind.config.js             # Theme custom colors configurations
│   ├── postcss.config.js
│   └── vite.config.js                 # Proxy setup for development
├── package.json                       # Root script orchestrator
└── README.md                          # Documentation
```

---

## 🗄️ MongoDB Schema Definition

The `Volunteer` model captures all authentication credentials, profile statistics, and participation logs:

```javascript
{
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Auto-hashed using Bcryptjs
  phone: { type: String, required: true },
  city: { type: String, required: true },
  skills: [String], // Array of skills (Teaching, Design, Logistics, etc.)
  availability: { 
    type: String, 
    enum: ['Weekdays', 'Weekends', 'Full-time', 'Flexible'], 
    default: 'Flexible' 
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  role: { type: String, enum: ['volunteer', 'admin'], default: 'volunteer' },
  registrationDate: { type: Date, default: Date.now },
  participationHistory: [
    {
      eventName: { type: String, required: true },
      date: { type: Date, default: Date.now },
      description: { type: String, required: true }
    }
  ]
}
```

---

## 🚀 API Documentation

All routes require standard JSON payloads and return JSON responses.

### Authentication APIs

- **`POST /api/auth/register`**
  - **Access**: Public
  - **Payload**: `{ fullName, email, password, phone, city, skills, availability }`
  - **Description**: Registers a new volunteer user. Returns user profile details and JWT token.

- **`POST /api/auth/login`**
  - **Access**: Public
  - **Payload**: `{ email, password }`
  - **Description**: Verifies credentials. Returns JWT token and profile details.

### Volunteer Management APIs (Protected)

- **`GET /api/volunteers`**
  - **Access**: Private/Admin
  - **Query Params**: `page` (default 1), `limit` (default 10), `search` (name, email, city, skills), `status` (`active`/`inactive`), `availability`, `exportCsv` (`true` to get all matches for download).
  - **Description**: Returns a paginated list of volunteers.

- **`GET /api/volunteers/stats`**
  - **Access**: Private/Admin
  - **Description**: Returns dashboard statistics: Total volunteers, Active volunteers, New registrations in the last 30 days.

- **`POST /api/volunteers`**
  - **Access**: Private/Admin
  - **Payload**: `{ fullName, email, password, phone, city, skills, availability, status, participationHistory }`
  - **Description**: Creates a new volunteer profile from the admin interface.

- **`GET /api/volunteers/:id`**
  - **Access**: Private (Admin or Volunteer Owner)
  - **Description**: Retrieve a specific volunteer's profile info.

- **`PUT /api/volunteers/:id`**
  - **Access**: Private (Admin or Volunteer Owner)
  - **Payload**: Profile details (Admins can also edit `status`, `role`, and `participationHistory` details).
  - **Description**: Updates profile details in database.

- **`DELETE /api/volunteers/:id`**
  - **Access**: Private/Admin
  - **Description**: Delete a volunteer from the system database.

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js installed (v18+ recommended)
- Local MongoDB instance running OR a MongoDB Atlas connection URI

### 1. Download & Install Dependencies
First, install the root concurrently package, and then install dependencies for both frontend and backend:
```bash
# Install root script runner
npm install

# Run automated batch installer for both backend and frontend folders
npm run install-all
```

### 2. Database Seeding (Mock Data Setup)
To populate the database with a test admin account and 7 mock volunteer profiles (complete with diverse skills and mock history items), run:
```bash
npm run seed
```

### 3. Run Development Server
To launch both the Node/Express backend (port 5000) and Vite React frontend (port 5173) in watch mode concurrently:
```bash
npm run dev
```

You can now open the app in your browser at `http://localhost:5173`.

---

## 🔑 Test Accounts (Seed Credentials)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@nayepankh.org` | `admin123` |
| **Volunteer** | `rahul.sharma@example.com` | `password123` |

*(Note: The server includes an auto-provisioner. If you do not run the seeder, launching the server will automatically create the default admin account on startup).*

---

## 🌐 Production Deployment Steps

### 1. MongoDB Atlas Configuration
1. Register at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster.
3. In **Network Access**, allow IP Address access (set `0.0.0.0/0` to allow API requests from Render).
4. Under **Database Access**, create a user and save the password.
5. Click **Connect** -> **Drivers**, and copy the connection string. Replace `<password>` with your database user password.

### 2. Backend Deployment on Render
1. Sign up on [Render](https://render.com/).
2. Click **New** -> **Web Service**.
3. Link your GitHub repository.
4. Select the environment parameters:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In **Environment Variables**, click Add and configure:
   - `PORT`: `10000` (Render allocates this automatically, but specifying it is safe)
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *A secure random string (e.g. `2y3b7498c4b283993c9d81d2ef93`)*
   - `JWT_EXPIRES_IN`: `30d`
6. Click **Create Web Service**. Copy the service URL (e.g. `https://nayepankh-api.onrender.com`).

### 3. Frontend Deployment on Vercel
1. Install Vercel CLI locally or connect via git at [Vercel](https://vercel.com).
2. For git deployment, import your repository.
3. Set the build parameters:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy the frontend.
5. *Important (Routing fallback)*: Create a file named `vercel.json` in your `frontend/public/` folder to prevent route 404 errors on browser refreshes:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
6. Modify the proxy target in Vite to point to the live Render endpoint for production, or adjust frontend fetch URLs to dynamically reference the backend API endpoint.
