const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Function to generate styled OTP email
const otpEmailTemplate = (otp, name = "User") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZappyCart OTP</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    h1 { color: #E53935; text-align: center; }
    p { font-size: 16px; color: #333333; }
    .otp { display: block; width: fit-content; margin: 20px auto; font-size: 32px; font-weight: bold; color: #E53935; letter-spacing: 4px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999999; }
    .btn { display: inline-block; background-color: #E53935; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>ZappyCart OTP</h1>
    <p>Hi ${name},</p>
    <p>Use the following One-Time Password (OTP) to complete your login/signup:</p>
    <span class="otp">${otp}</span>
    <p>This OTP is valid for <strong>5 minutes</strong>.</p>
    <div class="footer">
      <p>If you did not request this OTP, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;


// ⚠️ In-memory OTP store (temporary for dev only)
const otpStore = {}; // Format: { "contact": "OTP" }

// Generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 🔹 POST /api/auth/send-otp
const sendOtp = async (req, res) => {
  try {
    const { contact, type } = req.body;

    if (!contact || !type) {
      return res.status(400).json({ message: "Contact and type (login/signup) are required." });
    }

    const existingUser = await User.findOne({ contact });

    // 🔒 Type-based checks
    if (type === "login" && !existingUser) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    if (type === "signup" && existingUser) {
      return res.status(409).json({ message: "User already exists. Please log in instead." });
    }

    // ✅ Generate and store OTP
    const otp = generateOtp();
    otpStore[contact] = otp;

    console.log(`🔐 OTP for ${contact}: ${otp}`);

    try {
      await sendEmail({
        to: contact,
        subject: "Your OTP Code - ZappyCart",
        text: `Your One-Time Password is: ${otp}`,
        html: otpEmailTemplate(otp, ""),
        from: `"ZappyCart" <jatinjsssj1432@gmail.com>`,
      });

      return res.status(200).json({ message: "OTP sent successfully via email." });
    } catch (error) {
      console.error("OTP Email Error:", error.message);
      return res.status(500).json({ message: "Failed to send OTP email." });
    }

  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};


// 🔹 POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { contact, otp, name, isSignup } = req.body;

    if (!contact || !otp) {
      return res.status(400).json({ message: "Contact and OTP are required." });
    }

    const validOtp = otpStore[contact];
    if (!validOtp || validOtp !== otp) {
      return res.status(401).json({ message: "Invalid or expired OTP." });
    }

    delete otpStore[contact]; // Clear OTP after use

    let user = await User.findOne({ contact });

    // 🟡 If user is trying to login but doesn't exist
    if (!user && !isSignup) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // 🔴 If user is trying to sign up but already exists
    if (user && isSignup) {
      return res.status(409).json({ message: "User already exists. Please login." });
    }

    // 🟢 If it's a new signup
    if (!user && isSignup) {
      user = await User.create({
        contact,
        name: name || "",
        isVerified: true,
        provider: "otp",

      });
    } else {
      // Existing user logging in
      user.isVerified = true;
      await user.save();
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Authentication successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        contact: user.contact,
        isAdmin: user.isAdmin,
      },
    });

  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "OTP verification failed." });
  }
};

module.exports = { sendOtp, verifyOtp, generateOtp };
