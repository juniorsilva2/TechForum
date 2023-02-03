const CommentModel = require("../models/commentModel");
const UserModel = require("../models/userModel");
const PostModel = require("../models/postModel");

const createComment = async (req, res) => {
  try {
    const { authorID, postID } = req.params;
    const authorIDExist = await UserModel.findById(authorID, { password: 0 });
    const postIDExist = await PostModel.findById(postID);
    if (!authorIDExist || !postIDExist) return res.status(404).json({ message: "User or Post not found." });
    
    const { content } = req.body;
    if (!content) return res.status(404).json({ message: "Fields missing" });

    const comment = await CommentModel.create({
      postID,
      authorID,
      content,
      date: new Date()
    });

    res.status(200).json({ message: "Comment sucessfully created", comment });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const getComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find();
    if (comments.length === 0)
      return res.status(404).json({ message: "No comment found" });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Fields missing" });
    
    const commentUpdated = await CommentModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Comment successfully updated", commentUpdated });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    await CommentModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment successfully deleted", comment });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

module.exports = {
  createComment,
  getComment,
  getComments,
  updateComment,
  deleteComment,
};
