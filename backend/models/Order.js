const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true }
    }
  ],
  shippingAddress: {
  fullName: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
},
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  paymentResult: {
    id: String,
    status: String,
  },
  orderStatus: { type: String, default: "processing" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  isDelivered: { type: Boolean, default: false },
 deliveredAt: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
