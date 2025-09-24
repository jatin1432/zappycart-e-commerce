// src/pages/PaymentPage.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();

  useEffect(() => {
    if (!user || !cartItems.length) return;

    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = createOrder;
      document.body.appendChild(script);
    };

    const createOrder = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/api/orders/create",
          { amount: totalPrice },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: "INR",
          name: "ZappyCart",
          description: "Order Payment",
          order_id: data.id,
          handler: async function (response) {
            try {
              await axios.post(
                "/api/orders/place",
                {
                  cartItems,
                  totalPrice,
                  shippingAddress: "Default Shipping", // Replace with actual
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              clearCart();
              navigate("/order-success");
            } catch (err) {
              console.error("Order Save Failed", err);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: { color: "#e53935" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Razorpay Order Creation Failed", err);
      }
    };

    loadRazorpay();
  }, []);

  return <div className="text-center py-20">Processing Payment...</div>;
};

export default PaymentPage;
