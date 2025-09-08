const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../Controller/Product.Controller");
const { protect, adminOnly } = require("../Middleware/AdminMiddleware.authAdmin");

// Routes for handling products
router.post("/", protect, adminOnly, createProduct);// here via this route admin can post new product
router.get("/", getAllProducts);
router.get("/:id", getProduct); 
router.put("/:id", protect, adminOnly, updateProduct); // here route for update
router.delete("/:id", protect, adminOnly, deleteProduct); //and here for delete

module.exports = router;
