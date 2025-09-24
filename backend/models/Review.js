// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type:String,},
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
