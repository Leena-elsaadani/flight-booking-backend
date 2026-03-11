// ============================================================================
// USER MODEL
// ============================================================================
// Defines the MongoDB schema and model for User documents
// Users can register, login, and verify their email addresses

const mongoose = require("mongoose");

// Define the User collection schema
const userSchema = new mongoose.Schema({
  // User's full name (required field)
  name: { type: String, required: true },
  
  // User's email address (required, must be unique across all users)
  // Unique: true ensures no two users can have the same email
  email: { type: String, required: true, unique: true },
  
  // User's password (required) - stored as hashed value using bcrypt
  // Never store plain text passwords
  password: { type: String, required: true },
  
  // Flag indicating if user has verified their email address
  // Default is false - becomes true after email verification
  isVerified: { type: Boolean, default: false },
  
  // 6-digit code sent to user's email for verification
  // User must enter this code to verify their email
  verificationCode: { type: String },
  
  // Timestamp when the verification code expires
  // After expiration, a new code must be requested
  verificationCodeExpires: { type: Date }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Create and export the User model based on the schema
module.exports = mongoose.model("User", userSchema);