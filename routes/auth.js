const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');

// Load User model
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login');
});

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register');
});

// Login
router.post('/login', AuthController.login);

// Register
router.post(
  '/register',
  AuthController.registrationValidator(),
  AuthController.register
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
});

module.exports = router;
