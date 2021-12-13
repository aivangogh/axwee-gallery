const { check, validationResult } = require('express-validator');
const User = require('../models/UserModel');

// For Register validatior
exports.registration = () => {
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

// For change password validation
exports.updatePassword = () => {
  return [
    check('currentPassword')
      .isLength({ min: 6 })
      .trim()
      .withMessage('Password must be 6 characters or greater.'),
    check('newPassword')
      .isLength({ min: 6 })
      .trim()
      .withMessage('Password must be 6 characters or greater.'),
    check('confirmPassword')
      .isLength({ min: 6 })
      .trim()
      .withMessage('Password must be 6 characters or greater.'),
  ];
};
