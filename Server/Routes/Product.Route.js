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
router.post("/", protect, adminOnly, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct); 
router.put("/:id", protect, adminOnly, updateProduct); 
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
