const User = require('../models/UserModel');
const db = require('../config/database');
const apiResponse = require('../utils/authResponse');

// Get all user
exports.getAllUser = (req, res) => {
  try {
    User.find({}, function (err, users) {
      var userMap = {};

      users.forEach(function (user) {
        userMap[user._id] = user;
      });

      return res.send(userMap);
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

// Get specific user
exports.getUser = (req, res) => {
  try {
    User.findById(req.params.id).then((user) => {
      if (!user) return res.status(404).end();

      return res.status(200).json(user);
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

// Create new user
exports.createUser = (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
  });

  try {
    user
      .save()
      .then((newUser) => {
        return apiResponse.successResponseWithData(res, 'User added successfully.', newUser);
      })
      .catch((err) => {
        return apiResponse.ErrorResponse(res, err);
      });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

// Update specific user
exports.updateUser = (req, res) => {
  const user = new User({
    _id: req.params.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
  });

  try {
    User.updateOne({ _id: req.params.id }, user)
      .then(() => {
        return apiResponse.updateSuccessResponseWithData(
          res,
          'User updated successfully!',
          user
        );
      })
      .catch((error) => {
        return apiResponse.validationError(res, error);
      });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

// Delete specific user
exports.deleteUser = (req, res) => {
  try {
    User.deleteOne({ _id: req.params.id })
      .then(() => {
        return apiResponse.successResponse(res, 'User deleted successfully!');
      })
      .catch((error) => {
        return apiResponse.validationError(res, error);
      });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};
