import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useParams } from "react-router-dom";

// Fallback product images (if needed)
import m1 from "../assets/M1.webp";
import m2 from "../assets/M2.webp";
import g1 from "../assets/g1.webp";
import g4 from "../assets/g4.webp";
import g3 from "../assets/g3.webp";

const staticProducts = [
  { id: 1, name: "Men's Trending T-Shirt", price: 499, image: m1 },
  { id: 2, name: "Men's Cool T-Shirt", price: 499, image: m2 },
  { id: 3, name: "Women's Stylish T-Shirt", price: 499, image: g1 },
  { id: 4, name: "Women's Trending T-Shirt", price: 499, image: g4 },
  { id: 5, name: "Unisex Classic Tee", price: 499, image: g3 },
];

const ProductSection = () => {
  const { category } = useParams(); // gets /category/:category
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const endpoint = category
          ? `https://zappycart-e-commerce.onrender.com/api/products/category/${category}`
          : `https://zappycart-e-commerce.onrender.com/api/products`;

        const res = await axios.get(endpoint);

        
          setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="py-12 px-4 bg-gray-50" id="product">
      <h2 className="text-3xl font-bold text-center mb-8">
        {category ? (
          <>
            {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
            <span className="text-red-500">Category</span>
          </>
        ) : (
          <>
            Trending <span className="text-red-500">Products</span>
          </>
        )}
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSection;
