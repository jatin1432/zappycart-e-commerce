const jwt = require("jsonwebtoken");
const User = require("../models/User");

const googleCallback = async (req, res) => {
  const { email, name } = req.user; // from Passport
  let user = await User.findOne({ contact: email });
  if (!user) {
    user = await User.create({
      contact: email,
      name,
      provider: "google",
      isVerified: true
    });
  }
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.redirect(`https://zappycart-e-commerce-static.onrender.com/auth-success?token=${token}`);
  passport.authenticate("google", {
  successRedirect: "/auth-success",
  failureRedirect: "/login-failed",
})

};

module.exports = googleCallback;
