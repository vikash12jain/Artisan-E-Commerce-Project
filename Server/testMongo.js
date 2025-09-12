const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGO_URL
mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  });
