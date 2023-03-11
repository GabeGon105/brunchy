const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    autopopulate: true
  },
  userName: {
    type: String,
    required: true,
    autopopulate: true
  },
  userImage: {
    type: String,
    required: true,
    autopopulate: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  deleted: { type: Boolean },
  edited: { type: Boolean },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  toObject: { virtuals: true }
});
CommentSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'comment',
  autopopulate: true
});

CommentSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model("Comment", CommentSchema);
