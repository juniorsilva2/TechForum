const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
const TopicModel = require("../models/topicModel");
const CommentModel = require("../models/commentModel");

const createPost = async (req, res) => {
  try {
    const { authorID, topicID } = req.params;
    const authorIDExist = await UserModel.findById(authorID, { password: 0 });
    const topicIDExist = await TopicModel.findById(topicID);
    if (!authorIDExist || !topicIDExist) return res.status(404).json({ message: "User or Topic not found." });
    
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Fields missing" });

    const post = await PostModel.create({
      topicID,
      authorID,
      title,
      content,
      date: new Date()
    });

    const reputationUpdated = Number(authorIDExist.reputation) + 10;
    await UserModel.findByIdAndUpdate({ _id: authorID }, { reputation: reputationUpdated });
    res.status(200).json({ message: "Post successfully created", post });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const getPost = async (req, res) => {
  // try {
  //   const post = await PostModel.findById(req.params.postID);
  //   const author = await UserModel.find(post.authorID);
  //   const comments = await CommentModel.find({ postID: post.id });
  //   const users = await UserModel.find();
  //   const commentUsers = comments.forEach((comment) => {
  //     if (comment.authorID === user)
  //   })
  //   if (comments.length === 0)
  //     return res.render("post", { post, comments, user: null, message: "Nenhum comentário foi feito ainda" });
  //   if (req.user) {
  //     const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1, id: 1});
  //     return res.render("post", { topic, posts, user, message: null });
  //   }
  //   res.render("posts", { topic, posts, user: null, message: null });
  // } catch (error) {
  //   console.log(error.message);
  //   res.status(500).json({ message: "Server side error ocurred" });
  // }
};

const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ topicID: req.params.topicID });
    const topic = await TopicModel.findById(req.params.topicID);
    if (posts.length === 0)
      return res.render("posts", { topic, posts, user: null, message: "Nenhuma publicação foi feita neste tópico ainda" });
    if (req.user) {
      const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1, id: 1});
      return res.render("posts", { topic, posts, user, message: null });
    }
    res.render("posts", { topic, posts, user: null, message: null });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Fields missing" });
    
    const postUpdated = await PostModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Post successfully updated", postUpdated });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post successfully deleted", post });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

module.exports = {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
};
