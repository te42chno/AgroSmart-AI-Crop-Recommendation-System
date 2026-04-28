/**
 * Database seed script — creates default admin account and sample data.
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Prediction = require('./models/Prediction');

const seedData = async () => {
  await connectDB();
  console.log('Seeding database...\n');

  // Create admin
  let admin = await User.findOne({ email: 'admin@agrosmart.ai' });
  if (!admin) {
    admin = await User.create({ name: 'Admin', email: 'admin@agrosmart.ai', password: 'Admin@123', role: 'admin' });
    console.log('✓ Admin created: admin@agrosmart.ai / Admin@123');
  } else {
    console.log('→ Admin already exists');
  }

  // Create sample farmer
  let farmer = await User.findOne({ email: 'farmer@agrosmart.ai' });
  if (!farmer) {
    farmer = await User.create({ name: 'Ravi Kumar', email: 'farmer@agrosmart.ai', password: 'Farmer@123', role: 'farmer' });
    console.log('✓ Farmer created: farmer@agrosmart.ai / Farmer@123');
  } else {
    console.log('→ Farmer already exists');
  }

  // Create sample predictions
  const count = await Prediction.countDocuments();
  if (count === 0) {
    const samples = [
      { userId: farmer._id, inputs: { N: 90, P: 42, K: 43, temperature: 20.8, humidity: 82, ph: 6.5, rainfall: 202 }, result: { crop: 'rice', confidence: 0.95, allPredictions: [{ crop: 'rice', confidence: 0.95 }, { crop: 'jute', confidence: 0.03 }] } },
      { userId: farmer._id, inputs: { N: 85, P: 58, K: 41, temperature: 24.5, humidity: 65, ph: 7.0, rainfall: 70 }, result: { crop: 'wheat', confidence: 0.88, allPredictions: [{ crop: 'wheat', confidence: 0.88 }, { crop: 'maize', confidence: 0.06 }] } },
      { userId: farmer._id, inputs: { N: 70, P: 40, K: 35, temperature: 28, humidity: 75, ph: 6.2, rainfall: 180 }, result: { crop: 'sugarcane', confidence: 0.82, allPredictions: [{ crop: 'sugarcane', confidence: 0.82 }] } },
    ];
    await Prediction.insertMany(samples);
    console.log('✓ Sample predictions created');
  }

  console.log('\nSeeding complete!');
  process.exit(0);
};

seedData().catch(err => { console.error(err); process.exit(1); });
