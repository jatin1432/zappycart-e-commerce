// routes/webhook.js
const express = require("express");
const crypto = require("crypto");
const Order = require("../models/Order");

const router = express.Router();

router.post("/razorpay", express.raw({ type: "application/json" }), async (req, res) => {
  const secret = process.env.RAZORPAY_SECRET;

  const signature = req.headers["x-razorpay-signature"];
  const body = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.body.toString())
    .digest("hex");

  if (generatedSignature !== signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    const data = JSON.parse(body);

    // Save order based on webhook event
    if (data.event === "payment.captured") {
      const payment = data.payload.payment.entity;

      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          isPaid: true,
          razorpayPaymentId: payment.id,
          paidAt: new Date(payment.created_at * 1000),
          paymentResult: {
            id: payment.id,
            status: payment.status,
          },
          orderStatus: "paid"
        }
      );
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ message: "Internal error" });
  }
});

module.exports = router;
