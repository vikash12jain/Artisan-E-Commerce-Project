const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        sku: {
            type: String,
            required: true,
            default: "SKU",
            trim: true,
            unique:true
        },
        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true,
        },
        brand: {
            type: String,
            required: [true, "Brand is required"],
            trim: true,
        },
        color: {
            type: String,
            trim: true,
            default: "Not Specified",
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            trim: true,
        },
        sold: {
            type: Number,
            default: 0,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "price is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required."],
            trim: true,
        },
        image: {
            type: String,
            trim: true,
            required: [true, "Product image is required."],
        },
        ratings: {
            stars: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
