// controllers/orderController.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const User = require("../models/User");
const sendMail = require("../utils/sendEmail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const calculateTotal = (items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

// Create Razorpay Order
const createOrder = async (req, res) => {
  const { cartItems, paymentMethod } = req.body;
  const user = req.user;
  if (!cartItems?.length) return res.status(400).json({ message: "Cart is empty" });

  if (paymentMethod === "online") {
    const amount = calculateTotal(cartItems) * 100;
    const rpOrder = await razorpay.orders.create({ amount, currency: "INR", receipt: `rcpt_${Date.now()}` });
    // Save initial order stub
    await Order.create({ user: user._id, cartItems, totalPrice: amount / 100, razorpayOrderId: rpOrder.id, paymentStatus: "pending" });
    return res.json({ order: rpOrder });
  }

  return res.status(400).json({ message: "Invalid payment method" });
};

// Place Order (final)
const placeOrder = async (req, res) => {
  const { cartItems, shippingAddress, totalPrice, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  let isPaid = false, paidAt = null, paymentResult = {};
  if (paymentMethod === "online") {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
    if (expected !== razorpaySignature) return res.status(400).json({ message: "Invalid signature" });
    isPaid = true;
    paidAt = new Date();
    paymentResult = { id: razorpayPaymentId, status: "Paid" };
  }
  const order = await Order.create({ user: req.user._id, cartItems, shippingAddress, paymentMethod, totalPrice, isPaid, paidAt, paymentResult, orderStatus: isPaid ? "paid" : "processing" });
  // send confirmation mail
  if (req.user.email) await sendMail({ to: req.user.email, subject: "Order Confirmation", text: `Your order ${order._id} is confirmed.` });
  res.status(201).json(order);
};

// Verify Razorpay Signature (optional before final)
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
  if (expected !== razorpay_signature) return res.status(400).json({ success: false, message: "Invalid signature" });
  return res.json({ success: true });
};

const getOrders = async (req, res) => { const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); res.json(orders); };

const getAllOrders = async (req, res) => {
  try {
    console.log("Fetching all orders...");
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error in getAllOrders:", err.message);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

const updateOrderStatus = async (req, res) => { const o = await Order.findById(req.params.id); if (!o) return res.status(404).json({ message: "Not found" }); o.orderStatus = req.body.status; await o.save(); res.json(o); };

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isDelivered = true;
    order.deliveredAt = new Date();
    await order.save();

    res.json({ message: "Order marked as delivered", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/orderController.js
 const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ should not be undefined

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err.message);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};




module.exports = {
  createOrder,
  getOrders,
  verifyPayment,
  getAllOrders,
  updateOrderStatus,
  placeOrder,
  markOrderAsDelivered,
  getUserOrders,
};
