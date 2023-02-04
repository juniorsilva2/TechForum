const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
const TopicModel = require("../models/topicModel");
const CommentModel = require("../models/commentModel");

const createPost = async (req, res) => {
  try {
    const { topicID } = req.params;
    const { title, content } = req.body;
    const user = await UserModel.findById(req.user.id, { password: 0 });
    
    if (!title || !content) return res.render("postCreate", { message: "Por favor preencha todos os campos", user, topicID});

    function padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    }
    
    function formatDate(date) {
      return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('/');
    }

    const post = await PostModel.create({
      topic: topicID,
      user: user._id,
      title,
      content,
      date: formatDate(new Date()),
    });

    const reputationUpdated = Number(user.reputation) + 10;
    await UserModel.findByIdAndUpdate({ _id: user._id }, { reputation: reputationUpdated });
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const getPost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postID).populate('user')
    const comments = await CommentModel.find({ post: post._id }).populate('user')
    if (req.user) {
      const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1});
      if (!comments) return res.render("post", { post, comments: null, user, message: "Este post ainda não possui comentários" });
      return res.render("post", { post, comments, user, message: null });
    }
    if (!comments) return res.render("post", { post, comments: null, user:null, message: "Este post ainda não possui comentários" });
    res.render("post", { post, comments, user: null, message: null });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
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
    res.redirect("/");
  }
};

const updatePost = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 });
    const post = await PostModel.findById(req.params.postID);
    const { title, content } = req.body;
    if (!title || !content) return res.render("postEdit", { message: "Preencha todos os campos", user, post });
    await PostModel.findByIdAndUpdate(req.params.postID, req.body);
    res.redirect("/perfil");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const deletePost = async (req, res) => {
  try {
    await CommentModel.deleteMany({ post: req.params.postID });
    await PostModel.findByIdAndDelete(req.params.postID);
    res.redirect("/perfil");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const createPage = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 });
    res.render("postCreate", { message: null, user, topicID: req.params.topicID});
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
}

const updatePage = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 });
    const post = await PostModel.findById(req.params.postID);
    res.render("postEdit", { message: null, user, post });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
}

module.exports = {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  createPage,
  updatePage,
};
