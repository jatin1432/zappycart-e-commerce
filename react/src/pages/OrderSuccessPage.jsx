// src/pages/OrderSuccessPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
      <p className="mb-6">Thank you for shopping with ZappyCart. We will send you an email confirmation shortly.</p>
      <Link
        to="/"
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default OrderSuccessPage;
