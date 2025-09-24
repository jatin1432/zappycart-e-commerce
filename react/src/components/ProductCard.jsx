import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, addToCart, decreaseQuantity } = useCart();

  const cartItem = cartItems?.find((item) => item._id === product._id);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!user) return alert("Please log in first.");
    addToCart(product);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    decreaseQuantity(product._id);
  };

  const goToProductDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={goToProductDetails}
      className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Product Content */}
      <div className="px-4 py-3 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-lg font-bold text-red-500">₹{product.price}</p>
          {product.originalPrice && (
            <p className="text-sm line-through text-gray-400">₹{product.originalPrice}</p>
          )}
        </div>

        {/* Rating */}
        <div className="text-yellow-500 text-sm mt-1">
          ★★★★☆ <span className="text-gray-400">(124)</span>
        </div>

        {/* Cart Controls */}
        <div className="mt-auto">
          {cartItem ? (
            <div
              className="flex items-center justify-between bg-gray-100 rounded-full mt-3 py-1 px-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleDecrease}
                className="text-lg font-semibold text-gray-600 hover:text-black px-2"
              >
                −
              </button>
              <span className="font-semibold">{cartItem.quantity}</span>
              <button
                onClick={handleAdd}
                className="text-lg font-semibold text-gray-600 hover:text-black px-2"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded-full text-sm font-medium transition"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
