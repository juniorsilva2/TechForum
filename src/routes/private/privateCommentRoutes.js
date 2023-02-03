const express = require("express");
const router = express.Router();
const authenticated = require("../../middleware/authenticated");
const commentController = require("../../controllers/commentController");

// router.post("/api/comment/:authorID/:postID", checkToken, commentController.createComment);
// router.get("/api/comment/:id", checkToken, commentController.getComment);
// router.get("/api/comments", checkToken, commentController.getComments);
// router.put("/api/comment/:id", checkToken, commentController.updateComment);
// router.delete("/api/comment/:id", checkToken, commentController.deleteComment);

module.exports = router;
