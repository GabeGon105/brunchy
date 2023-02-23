const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const User = require("../models/User")

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id }).populate('likes').lean();
      res.json(posts);
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).populate('likes').lean();
      res.json(posts);
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('likes').populate({
        path: 'comments',
        populate: { path: 'user' }
      })
      // Find a like on this post by the logged in user and assign to a variable to act essentially as a boolean
      const like = await Like.find({ user: req.user.id, post: req.params.id })
      // Find if the logged in user has saved this post and assign to a variable to act essentially as a boolean
      const save = await User.find({ _id: req.user.id, postsSaved: req.params.id });
      const comments = post.toObject().comments
      res.json({ post: post.toObject() || null, comments, like, save });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

      // const post = await Post.create({
      //   title: req.body.title,
      //   image: result.secure_url,
      //   naverLink: req.body.naverLink,
      //   cloudinaryId: result.public_id,
      //   caption: req.body.caption,
      //   user: req.user.id,
      // });
      // console.log("Post has been added!");
      // // send success message
      // req.flash("success", { msg: "Post has been added!" });
      // res.json({ post, messages: req.flash() });

      
      const result = await req.files;

      // Upload images to cloudinary
      let multiplePicturePromise = result.map( async (picture) => {
        const res = await cloudinary.uploader.upload(picture.path);
        return [ res.secure_url, res.public_id ];
      });

      // await all the cloudinary upload functions in promise.all, exactly where the magic happens
      let imageResponses = await Promise.all(multiplePicturePromise);

      const post = await Post.create({
        title: req.body.title,
        image: imageResponses.map( upload => upload[0]),
        naverLink: req.body.naverLink,
        cloudinaryId: imageResponses.map( upload => upload[1]),
        caption: req.body.caption,
        user: req.user.id,
      });
      console.log("Post has been added!");
      // send success message
      req.flash("success", { msg: "Post has been added!" });
      res.json({ post, messages: req.flash() });

    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      const obj = { user: req.user.id, post: req.params.id };
      if ((await Like.deleteOne(obj)).deletedCount) {
        console.log("Likes -1");
        return res.json(-1)
      }
      await Like.create(obj);
      console.log("Likes +1");
      res.json(1)
    } catch (err) {
      console.log(err);
    }
  },
  savePost: async (req, res) => {
    try {
      // Find the current user
      const user = await User.findById(req.user.id);
      if ((user.postsSaved.includes(req.params.id))) {
        // find the index of the current post in the user.postsSaved array, then splice it out of the array
        const index = user.postsSaved.indexOf(req.params.id);
        user.postsSaved.splice(index, 1);
        const updatedUser = await user.save();
        console.log("Post has been unsaved.");
        return res.json(updatedUser);
      }
      // push the current post to the user's postsSaved array
      user.postsSaved.push(req.params.id);
      const updatedUser = await user.save();
      console.log("Post has been saved!");
      // return success message
      req.flash("success", { msg: "Post has been saved!" });
      return res.json({ updatedUser, messages: req.flash() });
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id }).populate('likes').populate('comments');
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      const commentIDs = [];
      const comments = post.comments;
      while (comments.length) {
        const comment = comments.pop();
        comments.push(...comment.comments);
        commentIDs.push(comment.id);
      }
      await Comment.deleteMany({ _id: { $in: commentIDs}});
      await Like.deleteMany({ post: req.params.id });
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      // send success message
      req.flash("success", { msg: "Post has been deleted." });
      res.json({ messages: req.flash() });
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
