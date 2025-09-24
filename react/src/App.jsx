import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import CartPage from "./components/CartPage";
import AuthSuccess from "./components/AuthSuccess";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProductDetails from "./pages/ProductDetails";
import ProfilePage from "./pages/ProfilePage";
import ShippingPage from "./components/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import { useAuth } from "./context/AuthContext";

// 🔐 Admin route protection
const AdminRoute = ({ element }) => {
  const { user } = useAuth();
  return user?.isAdmin ? element : <Navigate to="/" />;
};

// 🔐 Logged-in user protection (excluding admin)
const PrivateRoute = ({ element }) => {
  const { user } = useAuth();
  return user && !user.isAdmin ? element : <Navigate to="/" />;
};

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // 🎯 Redirect after Google login
  React.useEffect(() => {
    if (location.pathname === "/auth-success") {
      if (user?.isAdmin) {
        window.location.replace("/admin");
      } else if (user) {
        window.location.replace("/cart");
      }
    }
  }, [location.pathname, user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<HomePage />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* 🛒 User-only routes */}
          <Route path="/cart" element={<PrivateRoute element={<CartPage />} />} />
          <Route path="/user-dashboard" element={<PrivateRoute element={<UserDashboard />} />} />
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
          <Route path="/checkout" element={<PrivateRoute element={<ShippingPage />} />} />
          <Route path="/payment" element={<PrivateRoute element={<PaymentPage />} />} />
          <Route path="/order-success" element={<PrivateRoute element={<OrderSuccessPage />} />} />

          {/* 🛠️ Admin-only route */}
          <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
