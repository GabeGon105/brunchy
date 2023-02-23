const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      const comment = await Comment.create({
        text: req.body.text,
        user: req.user.id,
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
      const comment = await Comment.findById(req.params.commentId).populate('comments');
      if (!comment.comments.length){
        await comment.remove()
        console.log("Comment has been deleted!");
        return res.json(null)
      }
      comment.text = '';
      comment.deleted = true;
      const deletedComment = await comment.save();
      console.log("Comment has been cleared!");
      res.json(deletedComment)
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
      res.json(updatedComment)
    }
    catch (err) {
      console.log(err);
    }
  }
};
