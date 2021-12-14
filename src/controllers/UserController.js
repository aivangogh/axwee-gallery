const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const apiResponse = require('../helpers/authResponse');
const { repath } = require('../utils/repath');

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

// Get All User Post
exports.getAllUserPost = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .exec((err, post) => {
      let dbPost = [];
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
      } else {
        console.log(post);
        post.map((data, err) => {
          dbPost.push(data.authorId);
        });

        User.find({ _id: { $in: dbPost } })
          .then((user) => {
            res.render('profile', {
              user: req.user,
              post: post,
              postUser: user,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
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
        return apiResponse.successResponseWithData(
          res,
          'User added successfully.',
          newUser
        );
      })
      .catch((err) => {
        return apiResponse.ErrorResponse(res, err);
      });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

// Update user profile
exports.updateUserProfile = (req, res, next) => {
  const path = repath(req.file.path);
  const user = {
    username: req.body.username,
    bio: req.body.bio,
    img: { profile: path },
  };

  try {
    User.findByIdAndUpdate({ _id: req.params.id }, user, (err, user) => {
      if (err) {
        req.flash('error_msg', 'Error occured. Please try again.');
        res.redirect('/edit-profile');
      } else {
        res.redirect('/profile');
      }
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

// Update user personal info
exports.updateUserInfo = (req, res) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    User.findByIdAndUpdate({ _id: req.params.id }, user, (err, user) => {
      if (err) {
        req.flash('error_msg', 'Error occured. Please try again.');
        console.log(`Error`);
        res.redirect('/edit-info');
      } else {
        req.flash('success_msg', 'Personal Info changed.');
        console.log(`Success`);
        res.redirect('/edit-info');
      }
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

// Upload Post
exports.uploadPost = async (req, res, next) => {
  console.log(req.file);
  // console.log(request.body);
  let post = new Post({
    title: req.body.title,
    desc: req.body.caption,
    author: req.user._id,
    img: req.file.path,
  });

  try {
    post = await post
      .save()
      .then(() => {
        res.redirect('/gallery');
      })
      .catch((err) => {
        req.flash('error_msg', 'Post failed. Please try again.');
        res.render('/gallery', {
          title: req.body.title,
          desc: req.body.caption,
          img: req.file.path,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

// Update specific user password
exports.updatePassword = (req, res) => {
  const user = new User({
    password: req.body.password,
  });

  if (password != re) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      username,
      email,
      phone,
    });
  }

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

  try {
    User.updateOne({ _id: req.params.id }, user)
      .then(() => {
        req.flash('success_msg', 'Personal Info changed.');
        res.redirect('/edit-info');
      })
      .catch((error) => {
        req.flash('error_msg', 'Error occured. Please try again.');
        res.render('/edit-info', {
          user: req.user,
        });
      });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

// Delete specific user
exports.deleteUser = (req, res) => {
  try {
    User.findByIdAndDelete(
      {
        _id: req.params.id,
      },
      function (err, user) {
        if (err) throw err;
        res.locals.session.isLoggedIn = false;
        req.logout();
        req.flash('success_msg', 'Account deleted successfully');
        res.redirect('/login');
      }
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};
