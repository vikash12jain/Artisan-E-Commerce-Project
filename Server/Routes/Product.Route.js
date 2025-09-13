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
const monitorActivity = require('../Middleware/UserActivity.middleware.js')


router.post("/", protect, adminOnly,monitorActivity.logUserActivity, createProduct);
router.get("/", monitorActivity.logUserActivity,getAllProducts);
router.get("/:id",monitorActivity.logUserActivity, getProduct); 
router.put("/:id", protect, adminOnly,monitorActivity.logUserActivity, updateProduct); 
router.delete("/:id", protect, adminOnly,monitorActivity.logUserActivity, deleteProduct);

module.exports = router;
