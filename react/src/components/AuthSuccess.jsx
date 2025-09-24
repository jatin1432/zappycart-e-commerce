// src/components/AuthSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("zappy_token", token);
      setToken(token);

      try {
        const decoded = jwtDecode(token);
        setUser({ _id: decoded.id, isAdmin: decoded.isAdmin });
        navigate("/");
      } catch (error) {
        console.error("Token decode failed", error);
        navigate("/");
      }
    } else {
      console.error("No token received in /auth-success");
      navigate("/");
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default AuthSuccess;
