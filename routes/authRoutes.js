// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, verifyEmail } = require("../controllers/authController");

// NOTE: Pass function references (no parentheses)
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);

module.exports = router;