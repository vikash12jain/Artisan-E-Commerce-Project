require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User'); 

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedAdminUser = async () => {
  try {
    console.log('Checking for existing admin user...');

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      console.log('Admin user already exists. No action needed.');
      return;
    }

    console.log('Creating initial admin user...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adminpassword123', salt);

    const adminUser = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true, 
    });

    await adminUser.save();
    console.log('Admin user created successfully!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedAdminUser();