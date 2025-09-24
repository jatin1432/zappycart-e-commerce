// routes/reviewRoutes.js
const express = require("express");
const {
  addReview,
  getAllReviews,
  deleteReview,
  getAllWebsiteReviews
} = require("../controllers/reviewController");

const { adminOnly } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add", addReview);
router.get("/website", getAllWebsiteReviews);
router.get("/:productId", getAllReviews);
router.delete("/:id", adminOnly, deleteReview);

module.exports = router;
