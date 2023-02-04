const express = require("express");
const router = express.Router();
const authenticated = require("../../middleware/authenticated");
const postController = require("../../controllers/postController");

router.get("/post/create/:topicID", authenticated, postController.createPage);
router.post("/post/create/:topicID", authenticated, postController.createPost);
router.get("/post/edit/:postID", authenticated, postController.updatePage);
router.post("/post/edit/:postID", authenticated, postController.updatePost);
router.get("/post/delete/:postID", authenticated, postController.deletePost);

module.exports = router;
