// ✅ Updated and Modernized Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/ZappyCart.png";
import {
  FaBars, FaTimes, FaShoppingCart, FaUserCircle,
} from "react-icons/fa";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { sectionRefs } from "../pages/HomePage";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({});
  const [orders, setOrders] = useState([]);

  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const openModal = (type) => {
    setAuthType(type);
    setModalOpen(true);
    setMenuOpen(false);
  };

  const closeModal = () => setModalOpen(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  const scrollTo = (key) => {
    if (location.pathname === "/") {
      sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
    setMenuOpen(false);
  };

  const toggleProfile = async () => {
    if (user) {
      setUserData({ name: user.name, email: user.email });
      if (!profileOpen && !user.isAdmin) {
        try {
          const res = await axios.get("/api/orders/user", {
            headers: { Authorization: `Bearer ${localStorage.getItem("zappy_token")}` },
          });
          setOrders(res.data.orders || []);
        } catch (err) {
          console.error("Failed to fetch orders", err);
        }
      }
      setProfileOpen((prev) => !prev);
    } else {
      openModal("login");
    }
  };

  const handleEditSave = async () => {
    try {
      // TODO: PATCH /api/user/update with userData
      setEditMode(false);
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || profileOpen ? "hidden" : "auto";
  }, [menuOpen, profileOpen]);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="ZappyCart" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold text-red-600">Zappy<span className="text-gray-700">Cart</span></span>
          </Link>

          <div className="md:hidden text-2xl text-gray-600 cursor-pointer" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <ul className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
            <button onClick={() => scrollTo("product")} className="hover:text-red-500 transition">PRODUCTS</button>
            <button onClick={() => scrollTo("review")} className="hover:text-red-500 transition">REVIEW</button>
            <button onClick={() => scrollTo("contact")} className="hover:text-red-500 transition">CONTACT</button>

            {user ? (
              <>
                {!user.isAdmin && (
                  <Link to="/cart" className="relative">
                    <FaShoppingCart size={20} />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5 animate-bounce">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                )}
                <button onClick={toggleProfile} className="flex items-center space-x-1 hover:text-red-500 transition">
                  <FaUserCircle size={22} />
                  <span>{user.isAdmin ? "Admin" : "Profile"}</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => openModal("login")} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition">
                  Log In
                </button>
                <button onClick={() => openModal("signup")} className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100 transition">
                  Sign Up
                </button>
              </>
            )}
          </ul>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white px-4 py-4 space-y-4 shadow">
            <button onClick={() => scrollTo("product")} className="block w-full text-left hover:text-red-500">PRODUCTS</button>
            <button onClick={() => scrollTo("review")} className="block w-full text-left hover:text-red-500">REVIEW</button>
            <button onClick={() => scrollTo("contact")} className="block w-full text-left hover:text-red-500">CONTACT</button>
            {user ? (
              <>
                {!user.isAdmin && <Link to="/cart" className="block text-red-500">Cart</Link>}
                <button onClick={toggleProfile} className="block w-full text-left">Profile</button>
              </>
            ) : (
              <>
                <button onClick={() => openModal("login")} className="block w-full text-red-500">Log In</button>
                <button onClick={() => openModal("signup")} className="block w-full text-gray-700">Sign Up</button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Profile / Admin Panel */}
      {profileOpen && (
        <div ref={profileRef} className="fixed top-0 right-0 w-80 h-full bg-white/90 backdrop-blur-lg shadow-lg p-6 z-50 overflow-auto transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{user?.isAdmin ? "Admin Panel" : "My Profile"}</h2>
            <button onClick={() => setProfileOpen(false)} className="text-2xl">×</button>
          </div>

          {!editMode ? (
            <>
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-gray-500 mb-4">{user?.email}</p>
              <button onClick={() => setEditMode(true)} className="text-blue-500 text-sm mb-4">Edit Profile</button>

              {user?.isAdmin && (
                <button onClick={() => { setProfileOpen(false); navigate("/admin"); }} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4">
                  Admin Dashboard
                </button>
              )}

              <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Logout</button>
            </>
          ) : (
            <div className="space-y-3 mb-6">
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex gap-2">
                <button onClick={handleEditSave} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Save</button>
                <button onClick={() => setEditMode(false)} className="text-gray-500 px-4 py-1 rounded hover:underline">Cancel</button>
              </div>
            </div>
          )}

          {!user?.isAdmin && (
            <>
              <hr className="my-4" />
              <h3 className="font-semibold mb-2">Order History</h3>
              {orders.length > 0 ? orders.map((o) => (
                <div key={o._id} className="mb-3 p-3 border rounded text-sm">
                  <p><strong>ID:</strong> {o._id}</p>
                  <p><strong>Status:</strong> {o.status}</p>
                  <p><strong>Total:</strong> ₹{o.total}</p>
                  <p><strong>Date:</strong> {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
              )) : <p className="text-gray-500">No orders found.</p>}
            </>
          )}
        </div>
      )}

      {modalOpen && <AuthModal isOpen={modalOpen} type={authType} onClose={closeModal} />}
    </>
  );
};

export default Navbar;
