// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
        <div>
          <h2 className="text-lg font-bold mb-2">About Us</h2>
          <p>
            Founded with a mission to make smart shopping fast and hassle-free, we connect you directly with top suppliers so you get trending products at the best prices — without paying a premium.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">We Believe In:</h2>
          <ul className="space-y-1">
            <li>⚡ Fast & reliable delivery</li>
            <li>🛡️ Secure payments</li>
            <li>📦 Quality-checked products</li>
            <li>💬 Friendly customer support</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Address</h2>
          <p>In Vijaynagar</p>
          <p>Near Radisson hotel</p>
          <p>Indore</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
