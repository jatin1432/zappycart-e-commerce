import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
const ShippingPage = () => {
  const { cartItems, totalPrice } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD", // or 'Online'
  });

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

 const handleContinue = async () => {
  const { fullName, phone, address, city, state, pincode, paymentMethod } = shippingInfo;

  if (!fullName || !phone || !address || !city || !state || !pincode) {
    return toast.info("Please fill all fields");
  }

  const shippingAddress = {
    fullName,
    phone,
    address,
    city,
    state,
    pincode,
  };

  localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));

  if (paymentMethod === "COD") {
    try {
      const res = await axios.post(
        "/api/orders/place",
        {
          cartItems,
          shippingAddress,
          totalPrice,
          razorpayOrderId: null,
          razorpayPaymentId: null,
          razorpaySignature: null,
          paymentMethod: "COD",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/order-success");
    } catch (err) {
      console.error("COD Order Error:", err);
      toast.error("Failed to place COD order");
    }
  } else {
    navigate("/payment");
  }
};

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
      <input
        className="w-full border p-2 mb-2"
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={shippingInfo.fullName}
        onChange={handleChange}
      />
      <input
        className="w-full border p-2 mb-2"
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={shippingInfo.phone}
        onChange={handleChange}
      />
      <input
        className="w-full border p-2 mb-2"
        type="text"
        name="address"
        placeholder="Address"
        value={shippingInfo.address}
        onChange={handleChange}
      />
      <input
        className="w-full border p-2 mb-2"
        type="text"
        name="city"
        placeholder="City"
        value={shippingInfo.city}
        onChange={handleChange}
      />
      <input
        className="w-full border p-2 mb-2"
        type="text"
        name="state"
        placeholder="State"
        value={shippingInfo.state}
        onChange={handleChange}
      />
      <input
        className="w-full border p-2 mb-4"
        type="text"
        name="pincode"
        placeholder="Pincode"
        value={shippingInfo.pincode}
        onChange={handleChange}
      />

      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={shippingInfo.paymentMethod === "COD"}
            onChange={handleChange}
          />
          Cash on Delivery
        </label>
        <label className="ml-4">
          <input
            type="radio"
            name="paymentMethod"
            value="Online"
            checked={shippingInfo.paymentMethod === "Online"}
            onChange={handleChange}
          />
          Online Payment
        </label>
      </div>

      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
};

export default ShippingPage;
