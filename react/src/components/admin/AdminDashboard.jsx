import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify"
const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const dropdownRef = useRef();

  
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://zappycart-e-commerce.onrender.com/api/orders/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Unwrap if response has wrapper
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.orders)
          ? res.data.orders
          : [];
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    useEffect(() => {
    fetchOrders();
  }, [token]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setConfirmLogout(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFilteredOrders(
      orders.filter(
        (o) =>
          o.user?.name?.toLowerCase().includes(val) ||
          o._id?.toLowerCase().includes(val)
      )
    );
  };

  const markAsDelivered = async (id) => {
    try {
      const res = await axios.put(
        `https://zappycart-e-commerce.onrender.com/api/orders/${id}/status`,
        { status: "Delivered" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = orders.map((o) => (o._id === id ? res.data.order : o));
      setOrders(updated);
      setFilteredOrders(updated);
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };
  const handleMarkDelivered = async (orderId) => {
  try {
    await axios.patch(
      `https://zappycart-e-commerce.onrender.com/api/orders/${orderId}/deliver`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Order marked as delivered");

    // Refresh order list
    fetchOrders();
  } catch (err) {
    console.error("Mark as delivered failed", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to mark order as delivered");
  }
};


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-4 py-2 border rounded"
          >
            <FaUserCircle className="text-2xl" />
            <span className="hidden sm:inline font-medium">{user?.name || "Admin"}</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-20 p-4 space-y-2">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-gray-500">{user?.email}</p>
              <hr />
              {!confirmLogout ? (
                <button
                  onClick={() => setConfirmLogout(true)}
                  className="w-full text-left text-red-600"
                >
                  Logout
                </button>
              ) : (
                <>
                  <p>Are you sure?</p>
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => setConfirmLogout(false)}>Cancel</button>
                    <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by name or order ID"
        className="w-full px-4 py-2 border rounded mb-6"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{order._id.slice(0, 8)}...</td>
                  <td className="p-3 text-sm">
                    <p className="font-medium">{order.user?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                  </td>
                  <td className="p-3">
                    {order.cartItems?.map((item, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <img src={item.image} alt="" className="w-10 h-10 object-contain" />
                        <div className="text-sm">
                          <p>{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 text-sm font-semibold text-red-600">₹{order.totalPrice}</td>
                  <td className="p-3 text-sm">
                    {order.orderStatus === "paid" ? (
                      <span className="text-green-600">Paid</span>
                    ) : (
                      <span className="text-yellow-600">Processing</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {!order.isDelivered && (
                      <button
                        onClick={() => handleMarkDelivered(order._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {order.isDelivered && (
                      <span className="text-green-700 font-semibold">Delivered</span>
                    )}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-8">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
