import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProductImageCarousel from "../components/ProductImageCarousel";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, addToCart, decreaseQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState({ color: "", size: "" });

  const cartItem = cartItems.find((item) => item._id === id);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        const fetchedProduct = res.data;
        setProduct(fetchedProduct);
        setSelectedVariant({
          color: fetchedProduct.variants?.color?.[0] || "",
          size: fetchedProduct.variants?.size?.[0] || ""
        });

        const all = await axios.get(`http://localhost:4000/api/products`);
        const filtered = all.data.filter(p => p.category === fetchedProduct.category && p._id !== id);
        setSimilarProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchProductData();
    fetchReviews();
  }, [id]);

  const handleAdd = () => {
    if (!user) return toast.info("Please log in to add to cart");
    addToCart({ ...product, selectedVariant });
  };

  const handleDecrease = () => decreaseQuantity(product._id);

  const handleReviewSubmit = async () => {
  if (!reviewInput.comment || !reviewInput.rating) {
    return toast.warn("Please enter a rating and comment.");
  }

  try {
    await axios.post(`http://localhost:4000/api/reviews/add`, {
      product: id,
      rating: reviewInput.rating,
      text: reviewInput.comment,
      name: user?.name || "Anonymous",
    });

    toast.success("Review submitted!");
    setReviewInput({ rating: 5, comment: "" });

    const res = await axios.get(`http://localhost:4000/api/reviews/${id}`,{
        rating: reviewInput.rating,
      text: reviewInput.text,
      name: user?.name || "Anonymous",
    });
    setReviews(res.data);
  } catch (error) {
    console.error("Review submit error:", error.response?.data || error.message);
    toast.error("Failed to submit review");
  }
};


  const getDeliveryRange = () => {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    start.setDate(today.getDate() + 3);
    end.setDate(today.getDate() + 5);
    return `${start.toDateString().slice(4)} - ${end.toDateString().slice(4)}`;
  };

  if (loading || !product) return <div className="p-8 text-center">Loading product...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 bg-gray-50">
      {/* Product Display */}
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-md">
        <ProductImageCarousel images={product.images || [product.image]} />

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-3 mb-4">
              <p className="text-lg line-through text-gray-400">₹{Math.round(product.price * 1.2)}</p>
              <p className="text-2xl font-bold text-red-600">₹{product.price}</p>
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Variants */}
            {product.variants && (
              <div className="space-y-4 mb-6">
                {product.variants.color?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Color</label>
                    <select
                      value={selectedVariant.color}
                      onChange={(e) =>
                        setSelectedVariant({ ...selectedVariant, color: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {product.variants.color.map((color) => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                )}
                {product.variants.size?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Size</label>
                    <select
                      value={selectedVariant.size}
                      onChange={(e) =>
                        setSelectedVariant({ ...selectedVariant, size: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {product.variants.size.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <div className="flex items-center space-x-4">
              {cartItem ? (
                <>
                  <button
                    onClick={handleDecrease}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="text-gray-700 font-medium">{cartItem.quantity}</span>
                  <button
                    onClick={handleAdd}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAdd}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                >
                  Add to Cart
                </button>
              )}
            </div>

            <p className="mt-4 text-sm text-gray-500">
              🚚 Estimated delivery: <strong>{getDeliveryRange()}</strong>
            </p>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="mt-6 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            Go to Cart
          </button>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Specifications</h2>
          <div className="bg-white rounded-lg shadow divide-y border">
            {product.specifications.map((spec, idx) => (
              <div
                key={idx}
                className="flex justify-between px-4 py-3 hover:bg-gray-50 text-sm text-gray-700"
              >
                <span className="font-medium">{spec.key}</span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customer Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow-sm">
                <div className="text-yellow-500 text-sm mb-1">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <p className="text-gray-800">{review.text}</p>
                <p className="text-xs text-gray-500 mt-1">by {review.user || "Anonymous"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {user && (
          <div className="mt-6 bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Write a Review</h3>
            <select
              value={reviewInput.rating}
              onChange={(e) =>
                setReviewInput({ ...reviewInput, rating: Number(e.target.value) })
              }
              className="mb-2 border rounded px-3 py-1 w-full focus:outline-none"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>
            <textarea
              rows={3}
              value={reviewInput.text}
              onChange={(e) => setReviewInput({ ...reviewInput, text: e.target.value })}
              placeholder="Write your review..."
              className="border rounded w-full px-3 py-2 mb-2 focus:outline-none"
            />
            <button
              onClick={handleReviewSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {similarProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 object-contain mx-auto mb-3"
                />
                <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h4>
                <p className="text-red-600 font-semibold mt-1 text-sm">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
