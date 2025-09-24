const express = require("express");
const {
  createOrder,
  getOrders,
  placeOrder,
  getAllOrders,
  updateOrderStatus,
  verifyPayment,
  markOrderAsDelivered,
  getUserOrders
} = require("../controllers/orderController");
const { protect, adminOnly, requireSignIn } = require("../middlewares/authMiddleware");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const router = express.Router();

router.post("/create", protect, createOrder);        // Razorpay order
router.post("/place", protect, placeOrder);          // Final order placement (COD or Razorpay)
router.get("/", protect, getOrders);                 // User orders
router.post("/verify", protect, verifyPayment);      //verify payments
// Get all orders for admin
router.get("/admin", protect, adminOnly, getAllOrders);
 // Admin all orders
router.put("/:id/status", protect, adminMiddleware, updateOrderStatus); // Admin update order

// PATCH /api/orders/:id/deliver
router.patch("/:id/deliver", protect, adminOnly, markOrderAsDelivered);

// routes/orderRoutes.js
router.get("/user", getUserOrders);



module.exports = router;
