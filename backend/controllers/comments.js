const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      const comment = await Comment.create({
        text: req.body.text,
        userId: req.user.id,
        userName: req.user.userName,
        userImage: req.user.image,
				post: req.params.commentId ? undefined : req.params.postId,
        comment: req.params.commentId
      });
      console.log("Comment has been added!");
      res.json(comment);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      // Find comment by id
      const comment = await Comment.findById(req.params.commentId).populate('comments');

      await comment.remove()
      console.log("Comment has been deleted!");
      // return success message
      req.flash("success", { msg: "Comment has been deleted!" });
      return res.json({ messages: req.flash() });
    } catch (err) {
      console.log(err);
    }
  },
  editComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      comment.text = req.body.text;
      comment.edited = true;
      const updatedComment = await comment.save();
      console.log("Comment has been edited!");
      // return success message
      req.flash("success", { msg: "Comment has been edited!" });
      return res.json({ messages: req.flash(), updatedComment });
    }
    catch (err) {
      console.log(err);
    }
  }
};
