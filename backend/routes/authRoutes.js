// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
require("../config/passportConfig");
const jwt = require("jsonwebtoken");

const { googleCallback } = require("../controllers/googleController");

const router = express.Router();

router.get("/google", (req, res, next) => {
  console.log("🔁 Google Auth Request URL triggered");
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));


// After successful Google OAuth
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-failed" }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(`http://localhost:5173/auth-success?token=${token}`);
  }
);
router.get("/google/callback-test", (req, res) => {
  res.send("✅ Callback route is working");
});
module.exports = router;
