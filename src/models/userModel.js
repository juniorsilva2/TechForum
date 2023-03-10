const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  realName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  reputation: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
