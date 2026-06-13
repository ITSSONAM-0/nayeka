import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import Volunteer from './models/Volunteer.js';

// Load environment variables
dotenv.config();

// Allowed client origins (comma-separated in Render/Vercel env var)
const ALLOWED_CLIENT_ORIGINS = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(',').map((u) => u.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

// Temporary shortcut for testing: allow all origins when true
const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === 'true';

// Connect to local or Atlas MongoDB database
connectDB().then(() => {
  // Proactively check and initialize default Admin user
  initializeDefaultAdmin();
});

const app = express();

// Middleware
if (ALLOW_ALL_ORIGINS) {
  // WARNING: this allows any origin. Use only for testing.
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
} else {
  app.use(
    cors({
      origin: (origin, callback) => {
        // allow non-browser or same-origin requests
        if (!origin) return callback(null, true);
        if (ALLOWED_CLIENT_ORIGINS.includes(origin)) return callback(null, true);
        return callback(new Error('CORS policy: origin not allowed'));
      },
      credentials: true
    })
  );
}
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/volunteers', volunteerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'NayePankh API is active and running' });
});

// Custom Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('Server error handling:', err);
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Provison helper for default admin
async function initializeDefaultAdmin() {
  try {
    const adminExists = await Volunteer.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('Provisioning system: No admin account found. Creating default admin...');
      await Volunteer.create({
        fullName: 'NayePankh Admin',
        email: 'admin@nayepankh.org',
        password: 'admin123', // Auto-hashed by pre-save hook
        phone: '9999999999',
        city: 'Noida',
        skills: ['Leadership', 'Event Planning', 'Public Relations'],
        availability: 'Full-time',
        role: 'admin',
        status: 'active',
        participationHistory: []
      });
      console.log('Default admin created successfully:');
      console.log('  Email: admin@nayepankh.org');
      console.log('  Password: admin123');
    }
  } catch (error) {
    console.error('Error provisioning default admin:', error.message);
  }
}
