const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  images: [String],
  category: String,
  stock: Number,
  rating: Number,

  // ✅ New: Variants like color or size
  variants: {
    color: [String], // ["Red", "Blue"]
    size: [String],  // ["S", "M", "L"]
  },

  // ✅ New: Specifications / Features
  specifications: [
    {
      key: String,
      value: String,
    },
  ],
}, { timestamps: true });


module.exports = mongoose.model("Product", productSchema);
