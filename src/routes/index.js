const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const UserController = require('../controllers/UserController');
const PostController = require('../controllers/PostController');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('login', {
    user: req.user,
  });
});

// Dashboard
router.get('/home', ensureAuthenticated, PostController.getFeaturedPost);

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
router.get('/profile', ensureAuthenticated, UserController.getAllUserPost);

// Gallery
router.get('/gallery', ensureAuthenticated, PostController.getAllPost);

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
