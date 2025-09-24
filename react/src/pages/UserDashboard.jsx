import React, { useState } from "react";
import ProfilePage from "./ProfilePage";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-5">
        <h2 className="text-xl font-bold mb-6">My Account</h2>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer ${activeTab === "profile" ? "font-bold text-red-600" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </li>
          <li
            className={`cursor-pointer ${activeTab === "orders" ? "font-bold text-red-600" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </li>
          <li
            className={`cursor-pointer ${activeTab === "wishlist" ? "font-bold text-red-600" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            Wishlist
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {activeTab === "profile" && <ProfilePage />}
        {activeTab === "orders" && <p>Your orders will appear here.</p>}
        {activeTab === "wishlist" && <p>Your wishlist is empty.</p>}
      </div>
    </div>
  );
};

export default UserDashboard;
