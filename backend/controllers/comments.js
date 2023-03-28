const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");

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

      // Find the post user
      const post = await Post.findById(req.params.postId);
      const postUser = await User.findById(post.user);

      // if the current user is not the post user...
        // splice older comment notifications for this post id from the user notifications array,
        // delete older comment notifications for this post id,
        // create a new comment notification object,
        // then unshift the new notification id to the post user's notifications array
        if (req.user.id != post.user) {
          // If an existing comment notification with type 'comment' and this post id exists, delete it
          const notificationObj = { type: 'comment', postId: req.params.postId }
          const currentNotification = await Notification.find(notificationObj);
          if ( currentNotification[0] ) {
            // find the index of the current notification in the user.notifications array, then splice it out of the array
            const index = postUser.notifications.indexOf(currentNotification[0]._id);
            postUser.notifications.splice(index, 1);
            await postUser.save();
            await Notification.deleteOne(notificationObj);
            console.log(`Deleted previous comment notification for postId ${req.params.postId}.`);
          }

          // Create a new comment notification
          const newNotification = await Notification.create({
            type: 'comment',
            forUser: post.user,
            user: req.user.id,
            userName: req.user.userName,
            userImage: req.user.image,
            postId: req.params.postId,
            postImage: post.image[0],
            read: false,
          })
          console.log(`New comment notification created for ${postUser.userName}.`)
          
          // push newNotification._id to postUser's notifications array
          await postUser.notifications.unshift(newNotification._id);
          await postUser.save();
        }

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
