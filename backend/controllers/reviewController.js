// controllers/reviewController.js
const Review = require("../models/Review");

// Add review (product or website)
const addReview = async (req, res) => {
  try {
    const { name, text, product, rating } = req.body;
    if (!name || !text) {
      return res.status(400).json({ message: "Name and text are required" });
    }

    const review = new Review({ name, rating, text, product: product || null });
    await review.save();
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Failed to add review" });
  }
};


// Get reviews for a product or website
const getAllReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    let reviews;

    if (productId === "website") {
      // Fetch general website reviews
      reviews = await Review.find({ product: null }).sort({ createdAt: -1 });
    } else {
      reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
    }

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

// Admin-only delete
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    await Review.findByIdAndDelete(reviewId);
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};

// For website-wide reviews (no product associated)
const getAllWebsiteReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: null }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch website reviews" });
  }
};

module.exports = { addReview, getAllReviews, deleteReview, getAllWebsiteReviews };
