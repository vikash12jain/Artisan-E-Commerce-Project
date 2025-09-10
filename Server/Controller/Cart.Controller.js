const asyncHandler = require("express-async-handler");
const User = require("../Models/User.model");
const Product = require("../Models/Product.model");


exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const user = req.user; 

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }
  

  const existingItem = user.cart.find(item => item.productId.toString() === productId);
  
  if (existingItem) {
    
    existingItem.quantity += quantity;
  } else {
    
    user.cart.push({ productId, quantity });
  }

  await user.save();
  res.status(200).json({ message: "Product added to cart successfully.", cart: user.cart });
});

exports.removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = req.user;

    const cartIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (cartIndex > -1) {
        user.cart.splice(cartIndex, 1);
        await user.save();
        res.status(200).json({ message: "Product removed from cart successfully.", cart: user.cart });
    } else {
        res.status(404).json({ message: "Product not found in cart." });
    }
});



exports.getCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.productId');
    res.status(200).json(user.cart);
});

exports.clearCart = asyncHandler(async (req, res) => {
  const user = req.user;
  user.cart = []; // empty array
  await user.save();
  res.status(200).json({ message: "Cart cleared successfully.", cart: user.cart });
});
