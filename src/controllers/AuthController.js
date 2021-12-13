const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

/**
 * User login
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

/**
 *  User Registration
 *
 *  @param {string}   firstName
 *  @param {string}   lastName
 *  @param {string}   username
 *  @param {string}   email
 *  @param {int}      phone
 *  @param {string}   password
 *
 *  @returns {Object}
 *
 */
exports.register = (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    username,
    email,
    phone,
    password,
    confirmPassword,
  } = req.body;
  let errors = [];

  if (password != confirmPassword) {
    errors.push({ msg: 'Password does not match.' });
    res.render('register', {
      errors,
      firstName,
      lastName,
      username,
      email,
      phone,
    });
  } else {
    const error = validationResult(req);

    error
      .array({ onlyFirstError: true })
      .map((err) => errors.push({ msg: err.msg }));

    if (!error.isEmpty()) {
      res.render('register', {
        errors,
        firstName,
        lastName,
        username,
        email,
        phone,
        password,
      });
    } else {
      const newUser = new User({
        firstName,
        lastName,
        gender,
        username,
        email,
        phone,
        password,
      });

      bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/login');
          })
          .catch((err) => console.log(err));
      });
    }
  }
};
