
// const uri = "mongodb+srv://vikash12jain:9EPioWuavGmDtYP2@cluster0.bppekje.mongodb.net/ecomDB?retryWrites=true&w=majority&appName=Cluster0";
// const uri =    "mongodb+srv://vikash12jain_db_ADMIN:9EPioWuavGmDtYP2@cluster0.vmycbci.mongodb.net/ecomDB?retryWrites=true&w=majority&appName=Cluster0"
// const uri =  "mongodb+srv://vikash12jain_db_ADMIN:9EPioWuavGmDtYP2@cluster0.vmycbci.mongodb.net/ecomDB?retryWrites=true&w=majority&appName=Cluster0"  
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
