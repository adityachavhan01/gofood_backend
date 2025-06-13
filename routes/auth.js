const express = require('express');
const User = require('../models/userschema');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'mybirthdateis22102004';
// Route 1: Create a user using POST: "/api/auth/createuser"
router.post(
  '/createuser',
  [
    body('name', 'Name must be at least 3 characters long').isLength({ min: 3 }),
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const secpassword = await bcrypt.hash(password, salt);

      let newUser = await User.create({
        name,
        email,
        password:secpassword
      });

      const data = { user: newUser };
      return res.status(201).json({ success: true, data });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

// Route 2:- Authenticate a user a user using: POST "/api/auth/login". no login require
router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').exists().withMessage('Password cannot be blank')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentialss" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    const authToken = jwt.sign(payload, process.env.JWT_SECRET || 'adityaisgoodboy');
     return res.json({success:true ,authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({success:false});
  }
}
)

module.exports = router;
