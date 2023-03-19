const cloudinary = require("../middleware/cloudinary");
const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Post = require("../models/Post");

exports.getUser = async (req, res) => {
  try {
    const user = req.user || null;
    const everyPost = await Post.find();
    const everyPostId = everyPost.map( (post) => post._id );
    res.json({ user, everyPostId });
  }
  catch (err) {
      console.log(err);
    }
};

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
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Send success message
      req.flash("success", { msg: "Success! You are logged in." });
      res.json({ user, messages: req.flash() });
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
