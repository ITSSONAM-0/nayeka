import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Volunteer from './models/Volunteer.js';

dotenv.config();

const volunteersData = [
  {
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'password123',
    phone: '9812345678',
    city: 'Delhi',
    skills: ['Teaching', 'Mentoring', 'Public Speaking'],
    availability: 'Weekends',
    status: 'active',
    role: 'volunteer',
    registrationDate: new Date('2026-05-15'),
    participationHistory: [
      {
        eventName: 'Slum Education Camp',
        date: new Date('2026-05-20'),
        description: 'Taught mathematics and basic english to primary grade children.'
      },
      {
        eventName: 'Stationery Distribution Drive',
        date: new Date('2026-06-02'),
        description: 'Distributed books and school supply kits to 50+ students.'
      }
    ]
  },
  {
    fullName: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'password123',
    phone: '8765432109',
    city: 'Mumbai',
    skills: ['Content Writing', 'Social Media', 'Graphic Design'],
    availability: 'Flexible',
    status: 'active',
    role: 'volunteer',
    registrationDate: new Date('2026-05-28'),
    participationHistory: [
      {
        eventName: 'Digital Awareness Campaign',
        date: new Date('2026-06-05'),
        description: 'Designed social media banners and wrote blog posts explaining NGO operations.'
      }
    ]
  },
  {
    fullName: 'Amit Verma',
    email: 'amit.verma@example.com',
    password: 'password123',
    phone: '7012345678',
    city: 'Delhi',
    skills: ['Event Planning', 'Logistics', 'Fundraising'],
    availability: 'Weekdays',
    status: 'active',
    role: 'volunteer',
    registrationDate: new Date('2026-06-01'),
    participationHistory: []
  },
  {
    fullName: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    password: 'password123',
    phone: '9000123456',
    city: 'Hyderabad',
    skills: ['First Aid', 'Teaching', 'Health & Hygiene'],
    availability: 'Weekends',
    status: 'active',
    role: 'volunteer',
    registrationDate: new Date('2026-06-03'),
    participationHistory: [
      {
        eventName: 'Hygiene & Sanitization Workshop',
        date: new Date('2026-06-08'),
        description: 'Coordinated a workshop demonstrating handwashing techniques and personal hygiene.'
      }
    ]
  },
  {
    fullName: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'password123',
    phone: '9888776655',
    city: 'Jaipur',
    skills: ['Photography', 'Videography', 'Video Editing'],
    availability: 'Flexible',
    status: 'inactive',
    role: 'volunteer',
    registrationDate: new Date('2026-04-10'),
    participationHistory: [
      {
        eventName: 'Annual Cultural Fest',
        date: new Date('2026-04-20'),
        description: 'Captured photographs and recorded interviews with community beneficiaries.'
      }
    ]
  },
  {
    fullName: 'Ananya Sen',
    email: 'ananya.sen@example.com',
    password: 'password123',
    phone: '9111222333',
    city: 'Kolkata',
    skills: ['Content Writing', 'Translation', 'Teaching'],
    availability: 'Weekdays',
    status: 'active',
    role: 'volunteer',
    registrationDate: new Date('2026-06-10'),
    participationHistory: []
  },
  {
    fullName: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    password: 'password123',
    phone: '9222333444',
    city: 'Delhi',
    skills: ['Data Entry', 'Administrative Support', 'Logistics'],
    availability: 'Flexible',
    status: 'active',
    role: 'volunteer',
    registrationDate: new Date('2026-06-12'),
    participationHistory: []
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    console.log('Seeding process: Clearing existing volunteers...');
    await Volunteer.deleteMany({});

    console.log('Seeding process: Creating default admin user...');
    await Volunteer.create({
      fullName: 'NayePankh Admin',
      email: 'admin@nayepankh.org',
      password: 'admin123', // auto-hashed
      phone: '9999999999',
      city: 'Noida',
      skills: ['Leadership', 'Event Planning', 'Public Relations'],
      availability: 'Full-time',
      role: 'admin',
      status: 'active',
      participationHistory: []
    });

    console.log('Seeding process: Seeding volunteer profiles...');
    await Volunteer.create(volunteersData);

    console.log('Database seeded successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed:', error);
    process.exit(1);
  }
};

seedDB();
