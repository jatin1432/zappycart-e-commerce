import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ onClose }) => {
  const { 
    setUser, 
    setIsAuthenticated, 
    verifyOtp: contextVerifyOtp,
    sendOtp: contextSendOtp
  } = useAuth();

  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  // For Google login
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token) {
      localStorage.setItem("zappy_token", token);
      setIsAuthenticated(true);
      setUser(user);
      onClose();
    }
  }, []);

  const sendOtp = async () => {
    try {
      setMessage("Sending OTP...");
      await contextSendOtp(contact, mode);
      setOtpSent(true);
      setMessage("OTP sent successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
      setOtpSent(false);
    }
  };

  const verifyOtp = async () => {
    try {
      await contextVerifyOtp({
        contact,
        otp,
        name,
        type: mode
      });
      onClose(); // Close the modal after successful verification
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:4000/api/auth/google", "_self");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-2xl">
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          {mode === "login" ? "Login to ZappyCart" : "Create your ZappyCart account"}
        </h2>

        {mode === "signup" && (
          <>
            <input
              className="w-full border p-2 rounded mb-2"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </>
        )}

        <input
          className="w-full border p-2 rounded mb-2"
          type="text"
          placeholder="Enter your Email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />

        {!otpSent ? (
          <button
            onClick={sendOtp}
            className="w-full bg-red-500 text-white p-2 rounded"
            disabled={!contact}
          >
            Send OTP
          </button>
        ) : (
          <>
            <input
              className="w-full border p-2 rounded mb-2 mt-2"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button
                onClick={verifyOtp}
                className="w-full bg-green-500 text-white p-2 rounded"
                disabled={!otp}
              >
                Verify OTP
              </button>
              <button
                onClick={sendOtp}
                className="bg-yellow-400 text-white p-2 rounded"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {message && (
          <p className="text-sm text-red-600 mt-2 text-center">{message}</p>
        )}

        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  setMode("signup");
                  setOtpSent(false);
                  setMessage("");
                }}
              >
                Sign up here
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  setMode("login");
                  setOtpSent(false);
                  setMessage("");
                }}
              >
                Login here
              </span>
            </>
          )}
        </div>

        <div className="mt-4 border-t pt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-400 text-black py-2 rounded hover:bg-gray-100 flex items-center justify-center"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;