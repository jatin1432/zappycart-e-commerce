const Product = require("../models/Product.js");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();  // ✅ Should return an array
    res.json(products);  // ✅ MUST send the array directly
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      stock,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Server error while adding product" });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};
// Get products by category
const getProductsByCategory = async (req, res) => {
  const categoryParam = req.params.category;

  try {
    const products = await Product.find({
      category: { $regex: new RegExp(`^${categoryParam}$`, 'i') } // case-insensitive match
    });

    res.status(200).json(products);
  } catch (err) {
    console.error("Category fetch failed:", err.message);
    res.status(500).json({ message: "Server error while fetching category products" });
  }
};


module.exports = { addProduct, getAllProducts, getProductById, getProductsByCategory };
