const mongoose = require('mongoose');
const UserModel = require('./UserModel');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
  img: { type: String },
  createdAt: { type: Date, default: Date.now },
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Post', postSchema);
