const express = require("express");
const router = express.Router();
const authenticated = require("../../middleware/authenticated");
const commentController = require("../../controllers/commentController");

router.post("/comment/create/:userID/:postID", authenticated, commentController.createComment);
router.get("/comment/edit/:commentID", authenticated, commentController.updatePage);
router.post("/comment/edit/:commentID", authenticated, commentController.updateComment);
router.get("/comment/delete/:commentID", authenticated, commentController.deletePage);
router.post("/comment/delete/:commentID", authenticated, commentController.deleteComment);

module.exports = router;
