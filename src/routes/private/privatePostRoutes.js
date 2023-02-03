const express = require("express");
const router = express.Router();
const authenticated = require("../../middleware/authenticated");
const postController = require("../../controllers/postController");

// router.post("/api/post/:authorID/:topicID", checkToken, postController.createPost);
// router.get("/api/post/:id", checkToken, postController.getPost);
// router.get("/api/posts", checkToken, postController.getPosts);
// router.put("/api/post/:id", checkToken, postController.updatePost);
// router.delete("/api/post/:id", checkToken, postController.deletePost);

module.exports = router;
