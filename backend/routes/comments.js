const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");

router.post("/createComment/:postId/:commentId?", commentsController.createComment);

router.patch("/editComment/:postId/:commentId", commentsController.editComment);

router.delete("/deleteComment/:postId/:commentId", commentsController.deleteComment);

module.exports = router;
