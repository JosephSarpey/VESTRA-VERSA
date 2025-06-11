const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
    email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  activationOtp: String,
  activationOtpExpires: Date,
  isActivated: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;