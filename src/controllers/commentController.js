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
    if (!content) {
      return res.redirect("/post/"+postID);
    }
    
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
    
    await CommentModel.create({
      post: postID,
      user: authorID,
      content,
      date: formatDate(new Date()),
    });

    res.redirect("/post/"+postID);
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const updateComment = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 });
    const comment = await CommentModel.findById(req.params.commentID);
    const { content } = req.body;
    if (!content) return res.render("commentEdit", { message: "Por favor preencha o comentário", user, comment });
    await CommentModel.findByIdAndUpdate(req.params.commentID, req.body);
    res.redirect("/perfil");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const deleteComment = async (req, res) => {
  try {
    await CommentModel.findByIdAndDelete(req.params.commentID);
    res.redirect("/perfil");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const updatePage = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 });
    const comment = await CommentModel.findById(req.params.commentID);
    res.render("commentEdit", { message: null, user, comment });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  updatePage,
};
