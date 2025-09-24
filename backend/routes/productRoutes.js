const express = require("express");
const { getAllProducts,
    addProduct, 
    getProductById,
    getProductsByCategory } = require("../controllers/productController.js");
const router = express.Router();
const Product = require("../models/Product.js");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", getAllProducts);
router.post("/", protect, adminOnly, addProduct);
router.get("/:id", getProductById);
router.get("/category/:category", getProductsByCategory);

// router.post("/seed", async (req, res) => {
//   try {
//     const dummyProducts = [
//       {
//         name: "Bluetooth Smartwatch",
//         price: 1599,
//         image: "https://via.placeholder.com/300",
//       },
//       {
//         name: "Stylish Men's Tee",
//         price: 499,
//         image: "https://via.placeholder.com/300",
//       },
//       // Add more...
//     ];

//     await Product.insertMany(dummyProducts);
//     res.json({ message: "Dummy products added" });
//   } catch (err) {
//     console.error("Seeding error:", err);
//     res.status(500).json({ message: "Seeding failed" });
//   }
// });



module.exports =  router;
