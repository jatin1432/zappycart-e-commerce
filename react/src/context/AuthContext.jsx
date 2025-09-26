// context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("zappy_token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser({
          _id: decoded.id,
          name: decoded.name || "User",
          email: decoded.email || "",
          isAdmin: decoded.isAdmin || false,
        });
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    }
  }, []);

  const sendOtp = async (contact, type) => {
    try {
      const { data } = await axios.post("https://zappycart-e-commerce.onrender.com/api/otp/send", {
        contact,
        type,
      });
      return data;
    } catch (err) {
      console.error("Send OTP error:", err);
      throw err;
    }
  };

  const verifyOtp = async ({ contact, otp, name, type }) => {
    try {
      const { data } = await axios.post("https://zappycart-e-commerce.onrender.com/api/otp/verify", {
        contact,
        otp,
        name,
        isSignup: type === "signup",
      });

      localStorage.setItem("zappy_token", data.token);
      const decoded = jwtDecode(data.token);

      const userData = {
        _id: decoded.id,
        name: decoded.name || "User",
        email: decoded.email || contact,
        isAdmin: decoded.isAdmin || false,
      };

      setUser(userData);
      setToken(data.token);
      setIsAuthenticated(true);

      // Navigate after user is set
      navigate(userData.isAdmin ? "/admin" : "/cart");
      return data;
    } catch (err) {
      console.error("OTP Verification Failed:", err);
      throw err;
    }
  };

  const handleGoogleLogin = (tokenFromGoogle) => {
    try {
      const decoded = jwtDecode(tokenFromGoogle);
      localStorage.setItem("zappy_token", tokenFromGoogle);

      const userData = {
        _id: decoded.id,
        name: decoded.name || "Google User",
        email: decoded.email || "",
        isAdmin: decoded.isAdmin || false,
      };

      setUser(userData);
      setToken(tokenFromGoogle);
      setIsAuthenticated(true);

      // Navigate after user is set
      navigate(userData.isAdmin ? "/admin" : "/cart");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("zappy_token");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        setUser,
        setToken,
        sendOtp,
        verifyOtp,
        handleGoogleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
