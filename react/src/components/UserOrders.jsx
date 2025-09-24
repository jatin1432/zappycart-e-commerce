// components/UserOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get("/api/orders/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("zappy_token")}` },
      });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border p-3 rounded shadow">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> {order.isPaid ? "Paid" : "Unpaid"}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <ul className="mt-2 list-disc pl-4">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} x {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
