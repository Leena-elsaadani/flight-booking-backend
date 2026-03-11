// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================
// Defines all routes related to user authentication
// Routes for user registration, login, and email verification

const express = require("express");
const router = express.Router();

// Import controller functions that handle the route logic
const { register, login, verifyEmail } = require("../controllers/authController");

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

// POST /api/auth/register
// Register a new user account
// Body: { name: string, email: string, password: string }
// Response: { success: boolean, message: string }
router.post("/register", register);

// POST /api/auth/login
// Authenticate user and return JWT token
// Body: { email: string, password: string }
// Response: { success: boolean, message: string, data: { user, token } }
router.post("/login", login);

// POST /api/auth/verify-email
// Verify user's email address using verification code
// Body: { email: string, code: string }
// Response: { success: boolean, message: string }
router.post("/verify-email", verifyEmail);

// Export the router for use in server.js
// NOTE: Function references are passed without parentheses - this allows Express
// to call the controller functions when requests come in
module.exports = router;