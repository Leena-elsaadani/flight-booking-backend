// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sendEmail = require("../utils/sendEmail");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send email to Mailtrap
    await sendEmail(
      email,
      "Verify your Flight Booking account",
      `Your verification code is: ${verificationCode}`
    );

    res.status(201).json({
      success: true,
      message: "User registered. Check your email for verification code."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Optional: generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY EMAIL (optional)
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  // Add your verification logic if you use email codes
  res.status(200).json({ success: true, message: "Email verified" });
};