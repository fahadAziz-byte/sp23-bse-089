const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  picture: String,
  category: String
});

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;