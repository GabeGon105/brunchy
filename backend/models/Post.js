const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    require: true,
  },
  naverLink: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: Array,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  type: {
    type: Array,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  edited: { type: Boolean },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toObject: { virtuals: true }
});
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});
PostSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post',
  count: true
});


module.exports = mongoose.model("Post", PostSchema);
