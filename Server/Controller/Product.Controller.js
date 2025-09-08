const asyncHandler = require("express-async-handler");
const Product = require("../Models/Product.model");


exports.createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, brand, color, quantity, price, description, image } = req.body;

  if (!name || !category || !brand || !quantity || !price || !description || !image) {
    res.status(400);
    throw new Error("Product creation failed: some fields are missing or invalid"); // if any of thr above is false or  not there then it will throw an error 
  }

  const product = await Product.create({
    name,
    sku,
    category,
    brand,
    color,
    quantity,
    price,
    description,
    image,
    user: req.user._id, //it will get a user id ffrom req.user;
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Some fields are missing or incorrect. Please check and try again.");
  }
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort("-createdAt");
  res.status(200).json(products);
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("The requested product does not exist.");
  }

  res.status(200).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, brand, color, quantity, price, description, image } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found: Please check the ID and try again.");
  }

  product.name = name || product.name;
  product.sku = sku || product.sku;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.color = color || product.color;
  product.quantity = quantity || product.quantity;
  product.price = price || product.price;
  product.description = description || product.description;
  product.image = image || product.image;

  const updatedProduct = await product.save();
  res.status(200).json(updatedProduct);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("The product you are trying to delete does not exist.");
  }

  await product.deleteOne();

  res.status(200).json({ message: "Product deleted successfully." });
});
