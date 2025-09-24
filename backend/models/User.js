const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  googleId: String,
  address: String,
  avatar: String,
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  provider: { type: String, default: "otp" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
