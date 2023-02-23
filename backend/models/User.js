const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String, unique: true
  },
  email: {
    type: String, unique: true
  },
  password: String,
  image: {
    type: String,
    require: true,
    default: 'https://res.cloudinary.com/dz6fpptlg/image/upload/v1675860615/brunchyUser1_qn7tgi.png'
  },
  cloudinaryId: {
    type: String,
    require: true,
    default: 'brunchyUser1_qn7tgi'
  },
  bio: {
    type: String,
    default: ''
  },
  followers: Array,
  following: Array,
  postsLiked: Array,
  postsSaved: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
