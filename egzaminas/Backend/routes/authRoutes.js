const express = require('express');
const { signup, login, protect, logout } = require('../controller/authController.js');
const validate = require('../validator/validate.js');
const validateNewUser = require('../validator/signup.js');
const validateLogin = require('../validator/login.js');

const router = express.Router();

router.route('/signup').post(validateNewUser, validate, signup);
router.route('/login').post(validateLogin, login);
router.route('/logout').get(protect, logout);

module.exports = router;

