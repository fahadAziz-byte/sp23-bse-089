const express = require("express");
const fs=require('fs');
var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));

let adminProductsRouter = require("./routes/admin/products.controller");
server.use('/admin',adminProductsRouter);


server.get("/about-me", (req, res) => {
  return res.render("about-me");
});

server.get("/", (req, res) =>{
  res.render("HomePage.ejs");
});

server.post("/products/save",(req,res)=>{
  
})

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
