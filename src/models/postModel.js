const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  topicID: {
    type: String,
    required: true,
  },
  authorID: {
    type: String,
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
    type: Date,
    required: true,
  },
});

const PostModel = mongoose.model("post", postSchema);

module.exports = PostModel;
