require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../Models/User.model');

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
const AdminEmail ='admin@artisanstore.com';
const Adminpass = '4r@6%4^ol10a';

const seedAdminUser = async () => {
  try {
    console.log('Checking for existing admin user...');

    const existingAdmin = await User.findOne({ email: `${AdminEmail}` });

    if (existingAdmin) {
      console.log('Admin user already exists. No action needed.');
      return;
    }

    console.log('Creating initial admin user...');

    const salt = await bcrypt.genSalt(10);

    const admin = await User.create({
      fullname: {
        firstname: "Site",
        lastname: "Administrator",
      },
      email: `${AdminEmail}`,
      password: `${Adminpass}`,
      isAdmin: true,
    });
   console.log("admin registered successfully")
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedAdminUser();