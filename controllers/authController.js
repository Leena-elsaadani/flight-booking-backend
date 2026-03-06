const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
REGISTER
*/
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;

    // 1️ Check if user exists
    const userExists = await User.findOne({ Email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 2️ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // 3️ Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 4️ Create user with verification code
    const user = await User.create({
      Name,
      Email,
      Password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
    });

    // 5 Send verification email
    await sendEmail(
      Email,
      "Flight Booking Email Verification",
      `Hello ${Name},\n\nYour verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes.`
    );

    // 6️ Response
    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
      data: {
        Name: user.Name,
        Email: user.Email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
LOGIN
*/
exports.login = async (req, res) => {

  try {

    const { Email, Password } = req.body;

    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
  
  

};
exports.verifyEmail = async (req, res) => {
  try {
    const { Email, verificationCode } = req.body;

    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Verification code expired" });
    }

    // Mark verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
