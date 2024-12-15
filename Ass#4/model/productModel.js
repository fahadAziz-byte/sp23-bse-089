const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  picture:String
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
