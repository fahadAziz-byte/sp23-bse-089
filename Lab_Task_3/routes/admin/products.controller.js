const express = require("express");
const mongoose=require('mongoose')
let router = express.Router();
let Products=require('../../model/productModel');
router.use(express.urlencoded({ extended: true }));


router.get("/admin/products", async(req, res) => {
  let products=await Products.find();
  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});

router.post("/products/save",async(req,res)=>{
  let data=req.body;
  let newProduct=new Products(data);
  await newProduct.save();
  res.redirect('/admin/products');
})

router.get("/admin/products/create", (req, res) => {
    res.render("admin/products/create");
});

module.exports = router;

let connectionString = "mongodb://localhost/labAss#3";
mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));