const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const User = require("../models/User");
const Notification = require("../models/Notification")

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.params.id }).populate('likes').lean();
      const profileUser = await User.findById( req.params.id )
      
      // Map through profileUser.followers and find the userObj for each follower id
      const followersUsersArrPromise = profileUser.followers.map( async (follower) => {
        const followUser = await User.findById( follower );
        return [followUser._id, followUser.userName, followUser.image, followUser.bio];
      } )
      // Await all the followersUsersArrPromise functions in Promise.all
      const followersUsersArr = await Promise.all(followersUsersArrPromise);

      // Map through profileUser.following and find the userObj for each following id
      const followingUsersArrPromise = profileUser.following.map( async (following) => {
        const followUser = await User.findById( following );
        return [followUser._id, followUser.userName, followUser.image, followUser.bio];
      } )
      // Await all the followingUsersArrPromise functions in Promise.all
      const followingUsersArr = await Promise.all(followingUsersArrPromise);

      const user = await User.findById(req.user.id);

      // Map through user.notifications and find the notification Obj for each id
      const notificationsArrPromise = user.notifications.map( async (id) => {
        const notification = await Notification.findById( id );
        return notification;
      } )

      // Await all the notificationPromise functions in Promise.all
      const notifications = await Promise.all(notificationsArrPromise);

      res.json({posts, profileUser, followersUsersArr, followingUsersArr, notifications });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).populate('likes').lean();
      res.json({posts});
    } catch (err) {
      console.log(err);
    }
  },
  getSearch: async (req, res) => {
    try {
      const allPosts = await Post.find().sort({ createdAt: "desc" }).populate('likes').populate({
        path: 'comments',
        populate: { path: 'userId' }
      }).lean();
      
      const searchText = req.params.searchText.toLowerCase();
      // filter only posts that contain the search text in the title, description, or in any comments
      const posts = allPosts.filter( post => {
        return post.title.toLowerCase().includes(searchText)
        || post.caption.toLowerCase().includes(searchText)
        || post.comments.some( comment => comment.text.toLowerCase().includes(searchText) )
      } )

      
      res.json({posts});
    } catch (err) {
      console.log(err);
    }
  },
  getSaved: async (req, res) => {
    try {
      const savedPostIds = await req.user.postsSaved;

      // find all saved posts by their id
      const savedPostsPromise = savedPostIds.map( async (postId) => {
        const post = await Post.findById(postId).populate('likes').lean();
        return post;
      })

      // await all the find post by Id functions in promise.all, exactly where the magic happens
      const savedPostsUnfiltered = await Promise.all(savedPostsPromise)

      // filter out the posts that no longer exist and return null
      const savedPosts = savedPostsUnfiltered.filter( (post) => post)

      
      res.json({savedPosts});
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('likes').populate({
        path: 'comments',
        populate: { path: 'userId' }
      })
      
      // find the user of the user who created this post
      const postUser = await User.findById(post.user);

      // Find a like on this post by the logged in user and assign to a variable to act essentially as a boolean
      const like = await Like.find({ user: req.user.id, post: req.params.id })

      // Find all likes on this post and assign to a variable
      const likesArr = await Like.find({ post: req.params.id })
      
      // Map through likesArr and find the userObj for each like
      const likesUsersArrPromise = likesArr.map( async (like) => {
        const likeUser = await User.findById( like.user );
        return [likeUser._id, likeUser.userName, likeUser.image, likeUser.bio];
      } )

      // Await all the likesUsersrrPromise functions in Promise.all
      const likesUsersArr = await Promise.all(likesUsersArrPromise);

      // Find if the logged in user has saved this post and assign to a variable to act essentially as a boolean
      const save = await User.find({ _id: req.user.id, postsSaved: req.params.id });

      const comments = post.toObject().comments

      res.json({ post: post.toObject() || null, comments: comments, like, save, postUser , likesUsersArr: likesUsersArr});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
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
        type: req.body.type,
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
      let change = 0;
      if ((await Like.deleteOne(obj)).deletedCount) {
        console.log("Likes -1");
        change = -1;
      }
      else {
        await Like.create(obj);
        console.log("Likes +1");
        change = 1

        // find the post user
        const post = await Post.findById(req.params.id);
        const postUser = await User.findById(post.user);

        // if the current user is not the post user...
        // splice older like notifications for this post id from the user notifications array,
        // delete older like notifications for this post id,
        // create a new like notification object,
        // then unshift the new notification id to the post user's notifications array
        if (req.user.id != post.user) {
          // If an existing like notification with type 'like' and this post id exists, delete it
          const notificationObj = { type: 'like', postId: req.params.id }
          const currentNotification = await Notification.find(notificationObj);
          if ( currentNotification[0] ) {
            // find the index of the current notification in the user.notifications array, then splice it out of the array
            const index = postUser.notifications.indexOf(currentNotification[0]._id);
            postUser.notifications.splice(index, 1);
            await postUser.save();
            await Notification.deleteOne(notificationObj);
            console.log(`Deleted previous like notification for postId ${req.params.id}.`);
          }

          // Create a new like notification
          const newNotification = await Notification.create({
            type: 'like',
            forUser: post.user,
            user: req.user.id,
            userName: req.user.userName,
            userImage: req.user.image,
            postId: req.params.id,
            postImage: post.image[0],
            read: false,
          })
          console.log(`New like notification created for ${postUser.userName}.`)
          
          // push newNotification._id to postUser's notifications array
          await postUser.notifications.unshift(newNotification._id);
          await postUser.save();
        }
      }

      // Find all likes on this post and assign to a variable
      const likesArr = await Like.find({ post: req.params.id })
      
      // Map through likesArr and find the userObj for each like
      const likesUsersArrPromise = likesArr.map( async (like) => {
        const likeUser = await User.findById( like.user );
        return [likeUser._id, likeUser.userName, likeUser.image, likeUser.bio.slice(0, 30)];
      } )

      // Await all the likesUsersrrPromise functions in Promise.all
      const likesUsersArr = await Promise.all(likesUsersArrPromise);



      res.json({ change, likesUsersArr })
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
      // Loop through each element in post.image array and delete each image from cloudinary
      post.cloudinaryId.forEach( async (id) => {
        await cloudinary.uploader.destroy(id)
      } )
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
  editPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      post.title = req.body.title
      post.naverLink = req.body.naverLink
      post.caption = req.body.caption;
      post.edited = true;
      post.type = req.body.type;
      const updatedPost = await post.save();
      console.log("Post has been edited!");
      // return success message
      req.flash("success", { msg: "Post has been edited!" });
      return res.json({ messages: req.flash(), updatedPost });
    }
    catch (err) {
      console.log(err);
    }
}
};