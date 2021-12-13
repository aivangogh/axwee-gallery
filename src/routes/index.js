const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('login', {
    user: req.user,
  });
});

// Dashboard
router.get('/home', ensureAuthenticated, (req, res) => {
  console.log(req.user.img.profile);
  res.locals.session.isLoggedIn = true;
  res.render('home', {
    user: req.user,
  });
});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login');
});

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register', {
    errors: req.errors,
  });
});

// Profile
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', {
    user: req.user,
  });
});

// Gallery
router.get('/gallery', ensureAuthenticated, (req, res) => {
  res.render('gallery', {
    user: req.user,
  });
});

// About
router.get('/about', ensureAuthenticated, (req, res) => {
  res.render('about', {
    user: req.user,
  });
});

// Settings
router.get('/post', ensureAuthenticated, (req, res) => {
  res.render('post', {
    user: req.user,
  });
});

// Settings
router.get('/settings', ensureAuthenticated, (req, res) => {
  res.render('settings', {
    user: req.user,
  });
});

// Edit Personal Info
router.get('/edit-info', ensureAuthenticated, (req, res) => {
  res.render('edit-info', {
    user: req.user,
  });
});

// Edit Profile
router.get('/edit-profile', ensureAuthenticated, (req, res) => {
  res.render('edit-profile', {
    user: req.user,
  });
});

// Settings
router.get('/change-password', ensureAuthenticated, (req, res) => {
  res.render('change-password', {
    user: req.user,
  });
});

module.exports = router;
