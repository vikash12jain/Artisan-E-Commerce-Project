const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./Routes/User.Route");
const productRoutes = require("./Routes/Product.Route");
const cartRoutes = require("./Routes/Cart.Route");
const errorHandler = require("./Middleware/ErrorMiddleware");
const CheckoutRoutes = require('./Routes/Checkout.Routes');
const app = express();

app.use(express.json()); 
app.use(bodyParser.json());
app.use(cookieParser()); 
const clientOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/checkout", CheckoutRoutes); 

app.get('/', (req, res) => {
    res.send('hell0 world');
});
app.use(errorHandler);

const PORT = process.env.PORT || 4000;



mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });


