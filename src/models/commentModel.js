const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postID: {
    type: String,
    required: true,
  },
  authorID: {
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

const CommentModel = mongoose.model("comment", commentSchema);

module.exports = CommentModel;
