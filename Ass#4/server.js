const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const mongoose=require('mongoose');
let cookieParser = require("cookie-parser");
let session = require("express-session");
let User=require('./model/User')
let Product=require('./model/productModel');
let server = express();
server.use(express.urlencoded({extended:true}));
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.static('uploads'));
server.use(cookieParser());

let adminProductsRouter = require("../Ass#4/routes/admin/products.controller");
server.use('/admin',adminProductsRouter);

server.use(session({ secret: "my session secret" }));

server.get("/logout", async (req, res) => {
  req.session.user = null;
  return res.redirect("/login");
});
server.get("/login", async (req, res) => {
  return res.render("auth/login");
});
server.post("/login", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });
  if (!user) return res.redirect("/register");
  isValid = user.password == data.password;
  if (!isValid) return res.redirect("/login");
  req.session.user = user;
  return res.redirect("/");
});
server.get("/register", async (req, res) => {
  return res.render("auth/register");
});
server.post("/register", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });
  if (user) return res.redirect("/register");
  user = new User(data);
  await user.save();
  return res.redirect("/login");
});


server.get("/about-me", (req, res) => {
  return res.render("Portfolio.ejs");
});

server.get("/", (req, res) =>{
  let user=req.session.user;
  res.render("HomePage.ejs",{ user });
});

server.get('/shop',async(req,res)=>{
  let user=req.session.user;
  let products=await Product.find();
  res.render("shop.ejs",{ user,products });
})



server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});

let connectionString = "mongodb://localhost/sp23-bse-b";
mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));