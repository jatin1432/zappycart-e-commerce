const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/db");


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Passport config
require("./config/passportConfig");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Session middleware (needed for Google OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "zappy_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/otp", require("./routes/otpRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/webhook", require("./routes/webhook")); // for Razorpay
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("✅ ZappyCart API is running...");
});

// OPTIONAL: Serve frontend in production
// const path = require("path");
// app.use(express.static(path.join(__dirname, "../frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
