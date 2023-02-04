const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "topic",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
});

const PostModel = mongoose.model("post", postSchema);

module.exports = PostModel;
