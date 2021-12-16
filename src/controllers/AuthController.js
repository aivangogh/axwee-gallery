const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const fetch = require('isomorphic-fetch');

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
  let errors = [];
  // getting site key from client side
  const response_key = req.body['g-recaptcha-response'];
  // Put secret key here, which we get from google console
  const secret_key = '6Lf7n6QdAAAAALM0GgIIqGse-GLXwa9DodaaLiO1';

  // Hitting POST request to the URL, Google will
  // respond with success or error scenario.
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

  // Making POST request to verify captcha
  fetch(url, {
    method: 'post',
  })
    .then((response) => response.json())
    .then((google_response) => {
      // google_response is the object return by
      // google as a response
      if (google_response.success == true) {
        //   if captcha is verified
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
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/login');
                })
                .catch((err) => console.log(err));
            });
          }
        }
      } else {
        // if captcha is not verified
        errors.push({ msg: 'Missing captcha' });
        res.render('register', {
          errors,
          firstName,
          lastName,
          username,
          email,
          phone,
        });
      }
    })
    .catch((error) => {
      errors.push({ msg: 'Missing captcha' });
      res.render('register', {
        errors,
      });
    });
};
