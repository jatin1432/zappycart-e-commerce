import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    pincode: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { fullName, phone, address, pincode } = shippingInfo;
    if (!fullName || !phone || !address || !pincode) {
      setFormError("Please complete all shipping details.");
      return false;
    }
    return true;
  };

  const originalTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getDiscountedTotal = () => {
    if (appliedPromo === "WELCOME10") return originalTotal * 0.9;
    if (appliedPromo === "FLAT50") return originalTotal - 50;
    return originalTotal;
  };

  const applyPromo = () => {
    const validCodes = ["WELCOME10", "FLAT50"];
    if (validCodes.includes(promoCode.toUpperCase())) {
      setAppliedPromo(promoCode.toUpperCase());
      toast.success(`Promo code "${promoCode.toUpperCase()}" applied!`);
    } else {
      toast.error("Invalid promo code.");
    }
    setPromoCode("");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert("Cart is empty");
    if (!validate()) return;

    const totalPrice = getDiscountedTotal();

    const orderData = {
      paymentMethod: paymentMethod.toLowerCase(),
      cartItems,
      totalPrice,
      shippingAddress: shippingInfo,
    };

    try {
      if (paymentMethod === "COD") {
        const res = await axios.post(
          "http://localhost:4000/api/orders/place",
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        clearCart();
        navigate("/order-success");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000/api/orders/create",
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const rpOrder = data.order;
        const options = {
          key: "rzp_test_Iu5ncH2NPVO7qV",
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          order_id: rpOrder.id,
          name: "ZappyCart",
          description: "Order Payment",
          handler: async (resp) => {
            await axios.post(
              "http://localhost:4000/api/orders/verify",
              {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            await axios.post(
              "http://localhost:4000/api/orders/place",
              orderData,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            clearCart();
            navigate("/order-success");
          },
          prefill: {
            name: shippingInfo.fullName,
            email: user?.email || "",
            contact: shippingInfo.phone,
          },
          theme: { color: "#EF4444" },
        };

        new window.Razorpay(options).open();
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Error placing order. Try again.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Items & Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 bg-white rounded shadow"
                >
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                    <div>
                      <h2 className="font-semibold">{item.name}</h2>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decreaseQuantity(item._id)} className="px-2 border rounded">−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="px-2 border rounded">+</button>
                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 ml-4">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Info */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Shipping Details</h2>
              {formError && <p className="text-red-500 mb-2">{formError}</p>}
              <div className="grid grid-cols-1 gap-4">
                {["fullName", "phone", "address", "pincode"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field === "fullName" ? "Full Name" : field}
                    value={shippingInfo[field]}
                    onChange={handleChange}
                    className="p-2 border rounded w-full"
                  />
                ))}
              </div>
            </div>

            {/* Payment Method Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {/* COD */}
              <label
                className={`flex items-center gap-4 border rounded p-4 cursor-pointer w-full md:w-1/2 transition ${
                  paymentMethod === "COD" ? "border-red-600 bg-red-50" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  className="hidden"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <img src="https://cdn-icons-png.flaticon.com/512/455/455705.png" alt="COD" className="w-8 h-8" />
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when your order arrives at your doorstep.</p>
                </div>
              </label>

              {/* ONLINE */}
              <label
                className={`flex items-center gap-4 border rounded p-4 cursor-pointer w-full md:w-1/2 transition ${
                  paymentMethod === "ONLINE" ? "border-red-600 bg-red-50" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  className="hidden"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                <img src="..\assets\onlineIcon.jpg" alt="Razorpay" className="w-8 h-8 object-contain" />
                <div>
                  <p className="font-semibold">Online Payment</p>
                  <p className="text-sm text-gray-500">Pay securely via Razorpay (UPI, Card, Netbanking).</p>
                </div>
              </label>
            </div>
          </div>

          </div>

          {/* Right: Summary */}
          <div className="sticky top-24 h-fit bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{originalTotal.toFixed(2)}</span>
            </p>
            {appliedPromo && (
              <p className="flex justify-between text-green-600">
                <span>Promo ({appliedPromo}):</span>
                <span>-₹{(originalTotal - getDiscountedTotal()).toFixed(2)}</span>
              </p>
            )}
            <hr />
            <p className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{getDiscountedTotal().toFixed(2)}</span>
            </p>

            {/* Promo Code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={applyPromo}
                className="bg-gray-800 text-white px-4 rounded"
              >
                Apply
              </button>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-4"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
