const { body } = require('express-validator');
const { getUserByEmail } = require('../models/userModel');

module.exports = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email')
    .custom(async (email) => {
      try {
        await getUserByEmail(email);
        throw new Error('Email already in use');
      } catch (err) {
        return true;
      }
    }),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('passwordconfirm')
    .notEmpty().withMessage('Password confirmation is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];