const express = require("express");
var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);


server.get("/about-me", (req, res) => {
  return res.render("PortFolio.ejs");
});

server.get("/", (req, res) =>{
  res.render("HomePage.ejs");
});



server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
