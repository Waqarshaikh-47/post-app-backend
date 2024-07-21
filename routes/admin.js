const express = require('express');
const Admin = require('../models/Admin');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Admin login
router.post('/login', [
], async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ msg: 'Admin not Found' });
    }

    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials for admin' });
    }

    const payload = {
      user: {
        id: admin.id,
        role: 'admin',
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token,payload });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Activate user
router.put('/activate/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user)
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isActive = true;
    await user.save();

    res.json({ msg: 'User activated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all users
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
