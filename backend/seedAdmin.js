const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const username = 'admin';
    const plainPassword = 'admin123';

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log('Admin already exists. Nothing to do.');
      await mongoose.connection.close();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    await Admin.create({ username, password: hashedPassword });

    console.log('Admin created successfully');
    console.log('Username: ' + username);
    console.log('Password: ' + plainPassword);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();