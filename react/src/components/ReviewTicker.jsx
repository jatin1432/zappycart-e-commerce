import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewTicker = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch website reviews on load
  const fetchReviews = async () => {
    try {
      const res = await axios.get("https://zappycart-e-commerce.onrender.com/api/reviews/website");
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Submit new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("https://zappycart-e-commerce.onrender.com/api/reviews/add", {
        name: form.name,
        text: form.text,
        product: null, // explicitly for website
      });
      setForm({ name: "", text: "" });
      fetchReviews(); // Refresh
    } catch (err) {
      setError("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        What Our <span className="text-red-500">Customers</span> Say
      </h2>

      {/* Review Ticker */}
      <div className="overflow-x-auto whitespace-nowrap scroll-smooth mb-10">
        <div className="flex gap-6 animate-scroll">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={index}
                className="min-w-[280px] bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex items-center mb-2">
                  <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold uppercase mr-3">
                    {review.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-yellow-400 text-xs">★ ★ ★ ★ ★</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.text}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Add Your Review
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full border rounded px-4 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            name="text"
            placeholder="Your Review"
            className="w-full border rounded px-4 py-2"
            rows="3"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Optional: Tailwind animation keyframe */}
      <style>
        {`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        `}
      </style>
    </section>
  );
};

export default ReviewTicker;
