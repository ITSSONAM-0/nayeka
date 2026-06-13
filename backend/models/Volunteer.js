import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const participationSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  }
});

const volunteerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a full name']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    skills: {
      type: [String],
      default: []
    },
    availability: {
      type: String,
      enum: ['Weekdays', 'Weekends', 'Full-time', 'Flexible'],
      default: 'Flexible'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    role: {
      type: String,
      enum: ['volunteer', 'admin'],
      default: 'volunteer'
    },
    participationHistory: {
      type: [participationSchema],
      default: []
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
volunteerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
volunteerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
