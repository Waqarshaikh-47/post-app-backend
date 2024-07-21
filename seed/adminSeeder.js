const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!admin) {
      const newAdmin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
      });
      await newAdmin.save();
      console.log('Admin seeded');
    } else {
      console.log('Admin already exists');
    }
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
