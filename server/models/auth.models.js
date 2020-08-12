const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      default: 'User',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
  },
  { timestamps: true },
);

userSchema.virtual('password').set(function (password) {
  this._password = password;
});

userSchema.methods = {
  authenticate: function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.hashed_password, (err, isMatch) => {
      if (err) return cb(err);
      return cb(null, isMatch);
    });
  },
  encryptPassword: function (password, cb) {
    bcrypt.hash(password, 10, (err, encrypted) => {
      if (err) return cb(err);
      return cb(null, encrypted);
    });
  },
};

userSchema.pre('validate', function (next) {
  if (!this._password) return next();
  this.encryptPassword(this._password, (err, encrypted) => {
    if (err) return next(err);
    this.hashed_password = encrypted;
    return next();
  });
});

module.exports = mongoose.model('User', userSchema);
