const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },

  Email: {
    type: String,
    required: true,
    unique: true
  },

  Password: {
    type: String,
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verificationCode: {
    type: String
  },

  verificationCodeExpires: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);