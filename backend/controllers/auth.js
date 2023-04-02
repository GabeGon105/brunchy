const cloudinary = require("../middleware/cloudinary");
const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.getUser = async (req, res) => {
  try {
    const user = req.user ? await User.findById(req.user.id) : null

    if (user) {
      // Map through updatedUser.notifications and find the notification Obj for each id
      const notificationsArrPromise = user.notifications.map( async (id) => {
        const notification = await Notification.findById( id );
        return notification;
      } )

      // Await all the notificationPromise functions in Promise.all
      const notifications = await Promise.all(notificationsArrPromise);

      const everyPost = await Post.find();
      const everyPostId = everyPost.map( (post) => post._id );
      res.json({ user, everyPostId, notifications });
    }
    else {
      res.json({user});
    }
  }
  catch (err) {
      console.log(err);
    }
};
exports.getNotifications = async (req, res) => {
    try {
      const updatedUser = await User.findById(req.user.id).populate({
        path: 'notifications',
        populate: { path: 'forUser' }
      })

      // Map through updatedUser.notifications and find the notification Obj for each id
      const notificationsArrPromise = updatedUser.notifications.map( async (id) => {
        const notification = await Notification.findById( id );
        return notification;
      } )

      // Await all the notificationPromise functions in Promise.all
      const notifications = await Promise.all(notificationsArrPromise);

      res.json({ updatedUser, notifications });
    }
    catch (err) {
      console.log(err);
    }
  };
  exports.readNotifications = async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id);

      // if it's a follow notification update all follow notifications with the same user to read : true
      if (notification.type === 'follow') {
        await Notification.updateMany(
          {type: notification.type, user: notification.user },
          { read: true }
        )
        console.log(`Follow notification from ${notification.userName} has been set to read!`);
      }

      // if it's a comment or like notification find all comment or like notifications with the same postId to read : true
      if ( notification.type === 'comment' || notification.type === 'like' ) {
        await Notification.updateMany(
          {type: notification.type, postId: notification.postId },
          { read: true }
        )
        console.log(`${notification.type} notifications from post with ID ${notification.postId} have been set to read!`);
      }

      const updatedUser = await User.findById(req.user.id).populate({
        path: 'notifications',
        populate: { path: 'forUser' }
      })

      // Map through updatedUser.notifications to find the notification Obj for each id
      const notificationsArrPromise = updatedUser.notifications.map( async (id) => {
        return await Notification.findById( id );
      } )

      // Await all the notificationPromise functions in Promise.all
      const updatedNotifications = await Promise.all(notificationsArrPromise);

      // return success message and an updated notification object
      req.flash("success", { msg: "Notification has been read!" });
      return res.json({ messages: req.flash(), updatedNotifications, updatedUser });
    }
    catch (err) {
      console.log(err);
    }
  }

  exports.readAllNotifications = async (req, res) => {
    try {
      const updatedUser = await User.findById(req.user.id).populate({
        path: 'notifications',
        populate: { path: 'forUser' }
      })

      // Map through updatedUser.notifications, find the notification Obj for each id, update read to true for each obj, save each object, then return each new notification object
      const notificationsArrPromise = updatedUser.notifications.map( async (id) => {
        const notification = await Notification.findById( id );
        notification.read = true;
        const updatedNotification = await notification.save()
        return updatedNotification;
      } )

      // Await all the notificationPromise functions in Promise.all
      const updatedNotifications = await Promise.all(notificationsArrPromise);

      console.log("All user notifications have been set to read!")

      // return success message and an updated notification object
      req.flash("success", { msg: "All notifications have been read!" });
      return res.json({ messages: req.flash(), updatedNotifications });
    }
    catch (err) {
      console.log(err);
    }
  }

exports.deleteNotification = async (req, res) => {
  try {
      const notification = await Notification.findById(req.params.id);
      const user = await User.findById(req.user.id);

      // find the index of the current notification in the user.notifications array, then splice it out of the array
      const index = user.notifications.indexOf(notification._id);
      user.notifications.splice(index, 1);

      // if it's a follow notification, delete all follow notifications with the same user
      if (notification.type === 'follow') {
        await Notification.deleteMany({type: notification.type, user: notification.user })
        console.log(`Follow notification from ${notification.userName} has been deleted!`);
      }

      // if it's a comment or like notification delete all comment or like notifications with the same postId
      if ( notification.type === 'comment' || notification.type === 'like' ) {
        await Notification.deleteMany({type: notification.type, postId: notification.postId })
        console.log(`${notification.type} notifications from post with ID ${notification.postId} have been deleted!`);
      }

      const updatedUser = await user.save();

      // Map through updatedUser.notifications and find the notification Obj for each id
      const notificationsArrPromise = updatedUser.notifications.map( async (id) => {
        const notification = await Notification.findById( id );
        return notification;
      } )

      // Await all the notificationPromise functions in Promise.all
      const updatedNotifications = await Promise.all(notificationsArrPromise);

      // return success message
      req.flash("success", { msg: "Notification has been deleted!" });
      return res.json({ messages: req.flash(), updatedNotifications });
    } catch (err) {
      console.log(err);
    }
}

exports.deleteAllNotifications = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate({
        path: 'notifications',
        populate: { path: 'forUser' }
      })

      // clear the notifications array of user, then save
      user.notifications = [];
      const updatedUser = await user.save();

      // Delete all notifcations with the current user as its forUser
      await Notification.deleteMany({forUser: req.user.id})
      console.log("All user notifications have been deleted!")

      // return success message and an updated notification object
      req.flash("success", { msg: "All notifications have been deleted!" });
      return res.json({ messages: req.flash(), updatedNotifications: [], updatedUser });
    }
    catch (err) {
      console.log(err);
    }
  }

exports.getSearchUsers = async (req, res) => {
    try {
      const allUsers = await User.find().lean();
      
      const searchText = req.params.searchText.toLowerCase();
      // filter only users with userName properties that contain the search text
      const filteredUsers = allUsers.filter( user => {
        return user.userName.toLowerCase().includes(searchText);
      } )

      const users = filteredUsers.map( (user) => {
        return [user._id, user.userName, user.image, user.bio]
      })

      res.json({users});
    } catch (err) {
      console.log(err);
    }
  }

exports.followUser = async (req, res) => {
    try {
      // Find the current user and the profile user
      const user = await User.findById(req.user.id);
      const profileUser = await User.findById(req.params.id);
      if (user.following.includes(req.params.id) && profileUser.followers.includes(req.user.id) ) {
        // find the index of the current profile user ID in the user.following array, then splice it out of the array
        const index1 = user.following.indexOf(req.params.id);
        user.following.splice(index1, 1);
        const updatedUser = await user.save();

        // find the index of the current user ID in the profileUser.followers array, then splice it out of the array
        const index2 = profileUser.followers.indexOf(req.user.id);
        profileUser.followers.splice(index2, 1);
        const updatedProfileUser = await profileUser.save();

        const unfollowed = true;

        console.log("User has been unfollowed.");
        return res.json({ updatedUser, updatedProfileUser, unfollowed });
      }
      // push the current profileUserId to the user's following array
      user.following.push(req.params.id);
      const updatedUser = await user.save();

      // push the current user ID to the profile user's followers array
      profileUser.followers.push(req.user.id);

      // splice older follow notifications for this post id from the user notifications array,
      // delete older follow notifications for this post id,
      // create a new follow notification object,
      // then unshift the new notification id to the post user's notifications array
      const notificationObj = { type: 'follow', user: req.user.id }
      const currentNotification = await Notification.find(notificationObj);
      if ( currentNotification[0] ) {
        // find the index of the current notification in the user.notifications array, then splice it out of the array
        const index = profileUser.notifications.indexOf(currentNotification[0]._id);
        profileUser.notifications.splice(index, 1);
        await profileUser.save();
        await Notification.deleteOne(notificationObj);
        console.log(`Deleted previous follow notification for ${profileUser.username}.`);
      }

      // Create a new follow notification
      const newNotification = await Notification.create({
        type: 'follow',
        forUser: profileUser._id,
        user: req.user.id,
        userName: req.user.userName,
        userImage: req.user.image,
        read: false,
      })
      console.log(`New follow notification created for ${profileUser.userName}.`)
          
      // push newNotification._id to profileUser's notifications array
      profileUser.notifications.unshift(newNotification._id);

      const updatedProfileUser = await profileUser.save();

      const followed = true;

      console.log("User has been followed!");
      // return success message
      req.flash("success", { msg: `You are now following ${profileUser.userName}!` });
      return res.json({ updatedUser, updatedProfileUser, followed, messages: req.flash() });
    } catch (err) {
      console.log(err);
    }
}

exports.editUser = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      // If the user submitted a file to be uploaded, destroy the old photo and upload the new photo to Cloudinary
      if ( req.file ) {
        // If the current user photo is not the default photo with cloudinaryId 'brunchyUser1_qn7tgi', delete old photo from Cloudinary
        if ( user.cloudinaryId !== 'brunchyUser1_qn7tgi' ) {
          await cloudinary.uploader.destroy(user.cloudinaryId)
        }

        // Upload new photo to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Assign new values to user profile photo
        user.cloudinaryId = result.public_id;
        user.image = result.secure_url;
      }

      // Assign new values to user profile bio
      user.bio = req.body.bio;

      // Update user
      const updatedUser = await user.save();
      console.log("Profile has been edited!");
      // return success message
      req.flash("success", { msg: "Profile has been edited!" });
      return res.json({ messages: req.flash(), updatedUser });
    }
    catch (err) {
      console.log(err);
    }
}

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.json({ messages: req.flash() });
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.json({ messages: req.flash() });
    }
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }

      // Map through user.notifications and find the notification Obj for each id
      const notificationsArrPromise = user.notifications.map( async (id) => {
      const notification = await Notification.findById( id );
      return notification;
      } )

      // Await all the notificationPromise functions in Promise.all
      const notifications = await Promise.all(notificationsArrPromise);

      const everyPost = await Post.find();
      const everyPostId = everyPost.map( (post) => post._id );

      // Send success message
      req.flash("success", { msg: "Success! You are logged in." });
      res.json({ user, everyPostId, notifications, messages: req.flash() });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};


exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.json({ messages: req.flash() });
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.json({ messages: req.flash() });
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          // Send success message
          req.flash("success", { msg: "Success! Welcome to Brunchy :)" });
          res.json({ user, messages: req.flash() });
        });
      });
    }
  );
};
