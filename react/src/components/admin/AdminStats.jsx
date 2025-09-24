// src/components/admin/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
