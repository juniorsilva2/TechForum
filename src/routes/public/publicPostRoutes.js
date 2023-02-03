const express = require("express");
const router = express.Router();
const postController = require("../../controllers/postController");

router.get("/posts/:topicID", postController.getPosts);
router.get("/post/:postID", postController.getPost);

module.exports = router;
