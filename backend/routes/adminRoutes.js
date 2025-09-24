const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

router.get("/stats", adminMiddleware, async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalUsers
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// GET all users
router.get("/users", adminMiddleware, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// DELETE user by ID
router.delete("/users/:id", adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
