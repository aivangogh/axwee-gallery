const Post = require('../models/PostModel');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

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

// Get All Post
exports.getAllPost = (req, res) => {
  Post.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    } else {
      console.log(items);
      // res.render('/gallery');
      //   res.render('/gallery', { items: items });
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
  req.post = await Post.findById(req.params.id);
  let post = req.post;
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.description = req.body.description;

  try {
    blog = await post.save();
    //redirect to the view route
    res.redirect(`/post/${post.slug}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/seblogs/edit/${post.id}`, { post: post });
  }
};

///route to handle delete
exports.deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
};
