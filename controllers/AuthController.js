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
    failureRedirect: '/auth/login',
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
          res.redirect('/auth/login');
        })
        .catch((err) => console.log(err));
    });
  }
};

// For Registration validation
exports.registrationValidator = () => {
  return [
    check('firstName')
      .isLength({ min: 1 })
      .trim()
      .withMessage('First name must be specified.')
      .isAlphanumeric()
      .withMessage('First name has non-alphanumeric characters.'),
    check('lastName')
      .isLength({ min: 1 })
      .trim()
      .withMessage('Last name must be specified.')
      .isAlphanumeric()
      .withMessage('Last name has non-alphanumeric characters.'),
    check('gender')
      .not()
      .isEmpty()
      .withMessage('Gender is required')
      .isIn(['male', 'female']),
    check('username')
      .isLength({ min: 6 })
      .trim()
      .withMessage('Username must be specified.')
      .custom((value) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject('Username already in use');
          }
        });
      }),
    check('phone').optional({ checkFalsy: true }).isInt(),
    check('email')
      .isLength({ min: 1 })
      .trim()
      .withMessage('Email must be specified.')
      .isEmail()
      .withMessage('Email must be a valid email address.')
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        });
      }),
    check('password')
      .isLength({ min: 6 })
      .trim()
      .withMessage('Password must be 6 characters or greater.'),
  ];
};
