const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: Number },
    password: { type: String, required: true },
    bio: { type: String },
    img: {
      profile: { type: String, default: 'img/avatar2.png' },
      cover: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
