const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL // set this in Render environment
        : "http://localhost:5173",
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Session middleware (production-ready using MongoStore)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "zappy_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production",
    },
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
app.use("/api/webhook", require("./routes/webhook")); // Razorpay
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("✅ ZappyCart API is running...");
});

// Optional: Serve frontend in production
// const path = require("path");
// app.use(express.static(path.join(__dirname, "../frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
