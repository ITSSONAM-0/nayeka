import Volunteer from '../models/Volunteer.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new volunteer
// @route   POST /api/auth/register
// @access  Public
export const registerVolunteer = async (req, res) => {
  const { fullName, email, password, phone, city, skills, availability } = req.body;

  try {
    // Check if volunteer email already exists
    const volunteerExists = await Volunteer.findOne({ email });

    if (volunteerExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create volunteer
    const volunteer = await Volunteer.create({
      fullName,
      email,
      password,
      phone,
      city,
      skills: skills || [],
      availability: availability || 'Flexible',
      role: 'volunteer', // Explicitly prevent registering as Admin directly
      status: 'active'
    });

    if (volunteer) {
      res.status(201).json({
        success: true,
        data: {
          _id: volunteer._id,
          fullName: volunteer.fullName,
          email: volunteer.email,
          phone: volunteer.phone,
          city: volunteer.city,
          skills: volunteer.skills,
          availability: volunteer.availability,
          role: volunteer.role,
          status: volunteer.status,
          token: generateToken(volunteer._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid volunteer data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find volunteer
    const user = await Volunteer.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          city: user.city,
          skills: user.skills,
          availability: user.availability,
          role: user.role,
          status: user.status,
          participationHistory: user.participationHistory,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
