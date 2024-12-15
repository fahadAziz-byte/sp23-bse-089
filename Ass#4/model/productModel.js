const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  picture:String
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;

let products = [
    {
      title: "IPhone",
      price: "One Kidney",
      description: "Sweet Dreams",
      _id: 1,
    },
    {
      title: "Nokia",
      price: "Half Kidney",
      description: "Sweet Dreams/2",
      _id: 1,
    },
  ];