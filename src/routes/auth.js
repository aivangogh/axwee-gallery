const express = require('express');
const AuthController = require('../controllers/AuthController');
const Validator = require('../middlewares/validator');

const router = express.Router();

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
