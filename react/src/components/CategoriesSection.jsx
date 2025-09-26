// src/components/CategoriesSection.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const fallbackCategories = [
  { name: "Fashion", image: "https://cdn-icons-png.flaticon.com/512/892/892458.png" },
  { name: "Electronics", image: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png" },
  { name: "Accessories", image: "https://cdn-icons-png.flaticon.com/512/262/262611.png" },
  { name: "Home & Living", image: "https://cdn-icons-png.flaticon.com/512/2769/2769397.png" },
  { name: "Groceries", image: "https://cdn-icons-png.flaticon.com/512/135/135620.png" },
  { name: "Health & Beauty", image: "https://cdn-icons-png.flaticon.com/512/599/599305.png" },
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://zappycart-e-commerce.onrender.com/api/products/category");
        setCategories(res.data || fallbackCategories);
      } catch (error) {
        console.error("Failed to fetch categories, using fallback:", error);
        setCategories(fallbackCategories);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  return (
    <section className="bg-white py-12 px-6 md:px-12 lg:px-24 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Shop by <span className="text-red-500">Categories</span>
        </h2>

        {/* Mobile: Horizontal Scroll Carousel */}
        <div className="flex gap-4 overflow-x-auto sm:hidden scrollbar-hide pb-2">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="flex flex-col items-center min-w-[80px] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 hover:bg-red-100 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-gray-700 text-center">
                {category.name}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet Grid */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="cursor-pointer flex flex-col items-center justify-center bg-gray-100 hover:bg-red-100 transition-all duration-200 shadow rounded-lg p-4 group hover:shadow-md"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-inner mb-2 group-hover:scale-105 transition-transform">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <p className="text-sm font-semibold text-gray-800 text-center">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
