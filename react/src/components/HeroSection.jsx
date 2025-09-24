// src/components/HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/images1.png";

const HeroSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
            Shop Smart. <br />
            <span className="text-red-500">Deliver Fast.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Save up to <span className="font-semibold text-blue-500">30%</span> on every order.
            ZappyCart delivers quality products with secure payments & lightning-fast delivery.
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-start items-center gap-4 mt-6">
            <Link to="/products">
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300">
                Shop Now
              </button>
            </Link>
            <Link to="/about">
              <button className="border border-gray-400 text-gray-800 dark:text-white hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 font-medium py-3 px-6 rounded-md transition duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full max-w-md mx-auto drop-shadow-lg rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
