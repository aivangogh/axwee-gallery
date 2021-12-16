const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const { repath } = require('../utils/repath');

// Upload Post
exports.uploadPost = async (req, res, next) => {
  const path = repath(req.file.path);
  const post = new Post({
    title: req.body.title,
    desc: req.body.desc,
    authorId: req.user._id,
    img: path,
  });

  try {
    post = await post
      .save()
      .then(() => {
        res.redirect('/gallery');
      })
      .catch((err) => {
        req.flash('error_msg', 'Post failed. Please try again.');
        res.render('post', {
          title: req.body.title,
          desc: req.body.caption,
          img: req.file.path,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

// Get All Post
exports.getAllPost = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .exec((err, post) => {
      let dbPost = [];
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
      } else {
        post.map((data, err) => {
          dbPost.push(data.authorId);
        });

        User.find({ _id: { $in: dbPost } })
          .then((user) => {
            res.render('gallery', {
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

// Get All Post
exports.getFeaturedPost = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .exec((err, post) => {
      let dbPost = [];
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
      } else {
        post.map((data, err) => {
          dbPost.push(data.authorId);
        });

        User.find({ _id: { $in: dbPost } })
          .then((user) => {
            res.locals.session.isLoggedIn = true;
            res.render('home', {
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

// route that handles edit view
exports.getPost = async (req, res) => {
  let post = await Post.findById(request.params.id);
  res.render('edit', { post: post });
};

//route to handle updates
exports.updatePost = async (req, res) => {
  const path = repath(req.file.path);
  const post = {
    title: req.body.title,
    desc: req.body.desc,
    authorId: req.user._id,
    img: path,
  };

  try {
    User.findByIdAndUpdate({ _id: req.params.id }, post, (err, post) => {
      if (err) {
        req.flash('error_msg', 'Error occured. Please try again.');
        res.render('post', {
          title: req.body.title,
          desc: req.body.caption,
          img: req.file.path,
        });
      } else {
        res.redirect('gallery');
      }
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

///route to handle delete
exports.deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/gallery');
};
