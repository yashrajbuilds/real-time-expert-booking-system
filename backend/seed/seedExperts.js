require('dotenv').config();

const connectDB = require('../config/db');
const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

const experts = [
  {
    name: 'Dr. Maya Chen',
    category: 'Business Strategy',
    experience: 12,
    rating: 4.9,
    bio: 'Strategy advisor helping founders validate markets, pricing, and growth plans.',
    availableSlots: [
      { bookingDate: '2026-05-10', timeSlot: '09:00 AM', isBooked: false },
      { bookingDate: '2026-05-10', timeSlot: '11:00 AM', isBooked: false },
      { bookingDate: '2026-05-11', timeSlot: '02:00 PM', isBooked: false }
    ]
  },
  {
    name: 'YASHRAJ SINGH RATHORE',
    category: 'Software Architecture',
    experience: 15,
    rating: 4.8,
    bio: 'Cloud and backend architect focused on scalable APIs, platform design, and system reliability.',
    availableSlots: [
      { bookingDate: '2026-05-10', timeSlot: '10:00 AM', isBooked: false },
      { bookingDate: '2026-05-12', timeSlot: '01:00 PM', isBooked: false },
      { bookingDate: '2026-05-12', timeSlot: '04:00 PM', isBooked: false }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await Promise.all([Expert.deleteMany({}), Booking.deleteMany({})]);
    await Expert.insertMany(experts);
    console.log('Expert seed data imported successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
