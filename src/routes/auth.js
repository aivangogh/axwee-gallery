const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');

const Validator = require('../middlewares/validator');

// Load Authertication Redirection
const { forwardAuthenticated } = require('../config/auth');

// Login
router.post('/login', AuthController.login);

// Register
router.post('/register', Validator.registration(), AuthController.register);

// Logout
router.get('/logout', (req, res) => {
  res.locals.session.isLoggedIn = false;
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;
