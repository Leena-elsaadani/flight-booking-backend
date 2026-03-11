// ============================================================================
// AUTHENTICATION CONTROLLER
// ============================================================================
// Handles user authentication operations: registration, login, and email verification
// Manages user account creation, password security, JWT token generation, and email verification

const bcrypt = require("bcryptjs");        // For hashing and comparing passwords
const jwt = require("jsonwebtoken");       // For creating JWT tokens
const User = require("../models/User");    // User database model

const sendEmail = require("../utils/sendEmail");  // Utility function to send emails

// ============================================================================
// REGISTER - User Registration Handler
// ============================================================================
// POST /api/auth/register
// Creates a new user account with email verification
// 
// Request body: { name: string, email: string, password: string }
// Response: { success: boolean, message: string }

exports.register = async (req, res) => {
  try {
    // Extract user data from request body
    const { name, email, password } = req.body;

    // Validate that all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash the password using bcrypt with salt rounds of 10
n    // This ensures passwords are not stored in plain text
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random 6-digit verification code for email confirmation
    // Format: 100000-999999 (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user in the database with hashed password and verification code
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      // Verification code expires after 10 minutes
      verificationCodeExpires: Date.now() + 10 * 60 * 1000
    });

    // Send verification email to user's email address
    // The email contains the 6-digit verification code
    await sendEmail(
      email,
      "Verify your Flight Booking account",
      `Your verification code is: ${verificationCode}`
    );

    // Return success response to the client
    res.status(201).json({
      success: true,
      message: "User registered. Check your email for verification code."
    });

  } catch (error) {
    // Log error for debugging purposes
    console.error(error);
    // Return error response to client
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================================================
// LOGIN - User Login Handler
// ============================================================================
// POST /api/auth/login
// Authenticates user credentials and returns JWT token for session management
// 
// Request body: { email: string, password: string }
// Response: { success: boolean, message: string, data: { user, token } }

exports.login = async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Find user in database by email address
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare provided password with hashed password stored in database
    // bcrypt.compare returns true if passwords match, false otherwise
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token with user id and email
    // Token expires after 24 hours (1d)
    // Token is used to authenticate subsequent requests via Authorization header
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return successful login response with user data and token
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        // Return user info (excluding password) for frontend display
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email 
        },
        // Return JWT token to be stored on client side (localStorage or cookies)
        // Client will send this token in Authorization header for protected routes
        token
      }
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error(error);
    // Return error response to client
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// VERIFY EMAIL - Email Verification Handler
// ============================================================================
// POST /api/auth/verify-email
// Verifies user's email address using the verification code sent via email
// 
// Request body: { email: string, code: string }
// Response: { success: boolean, message: string }

exports.verifyEmail = async (req, res) => {
  // Extract email and verification code from request body
  const { email, code } = req.body;
  
  // Email verification logic implementation
  // TODO: Implement full verification logic:
  // 1. Find user by email
  // 2. Check if verification code matches
  // 3. Check if verification code has not expired
  // 4. Update user's isVerified flag to true
  // 5. Clear verification code and expiration from database
  
  // For now, returns a simple success response
  res.status(200).json({ success: true, message: "Email verified" });
};