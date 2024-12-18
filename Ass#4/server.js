const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const mongoose=require('mongoose');
let cookieParser = require("cookie-parser");
let session = require("express-session");
let User=require('./model/User')
let Product=require('./model/productModel');
let Category=require('./model/categoryModel');
let Order=require('./model/Orders');
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.static('uploads'));
server.use(cookieParser());

const bodyParser = require('body-parser');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
const auth=require('./middleware/auth-middleware');

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

server.get("/",auth, async(req, res) =>{
  let user=req.session.user;
  let products=await Product.find();
  res.render("HomePage.ejs",{ user,products });
});

server.get('/shop',auth,async(req,res)=>{
  let user=req.session.user;
  let products=await Product.find();
  let categories=await Category.find();
  res.render("shop.ejs",{ user,products,categories });
})

server.post('/searchProduct',auth,async(req,res)=>{
  let searchQuery=req.body.search;
  let user=req.session.user;
  let categories=await Category.find();
  console.log(searchQuery);
  if(searchQuery){
    let products=await Product.find({
      title: {
        $regex: searchQuery,
        $options: 'i'
    }
    })
    if(products){
      return res.render('shop',{user,products,categories});}
    return res.render('shop',{products:[],categories});
  }
  return res.redirect('/shop');
})

server.post('/filterProducts', async (req, res) => {
  const priceRanges= req.body.priceRange;
    console.log('Received price ranges:', priceRanges);

    if (!priceRanges || (Array.isArray(priceRanges) && priceRanges.length === 0)) {
        return res.redirect('/shop');
    }

    const ranges = Array.isArray(priceRanges) ? priceRanges : [priceRanges];

  


    const query = ranges.map(range => {
      if (range === '100000+') {
          return { price: { $gte: 100000 } };
      } else {
          const [min, max] = range.split('-').map(Number);
          return { price: { $gte: min, $lte: max } };
      }
  });

  try {
      let filteredProducts = await Product.find({ $or: query });
      let categories=await Category.find();
      return res.render('shop', { products: filteredProducts,categories });
  } catch (error) {
      console.error('Error filtering products:', error);
      return res.status(500).send('An error occurred while filtering products');
  }
});

server.post('/filterCategory',async(req,res)=>{
  let categoryName=req.body.name;
  let categories=await Category.find();
  let filteredProducts=await Product.find({category: categoryName});

  return res.render('shop', { products: filteredProducts, categories });
})

server.get("/cart",auth, async (req, res) => {
  let user=req.session.user;
  if(req.session.user){
    let cart = req.cookies.cart;
    cart = cart ? cart : [];
    let products = await Product.find({ _id: { $in: cart } });
    return res.render("cart", { products,user });
  }
  return res.redirect('/login');
});
server.get("/add-to-cart/:id", (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  return res.redirect("/cart");
});

server.get('/delete_cart_item/:id',auth,async(req,res)=>{
  if(req.session.user){
      let id=req.params.id;
      let cart=req.cookies.cart;
      console.log("Cart : "+cart);
      cart = cart ? cart : [];
      cart=cart.filter((item)=>item !== id);
      res.cookie('cart',cart);
      return res.redirect('/cart');
  }
  return res.redirect('/login');
})

server.get('/order',auth,async(req,res))


server.get('/buy_cart_item/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid Product ID");
    }

    // Find the product
    let product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).send("Product not found");
    }

    console.log(product);

    // Prepare order data
    let data = {
      title: product.title,
      price: product.price,
      description: product.description,
      email: req.session.user.email,
    };

    // Create and save new order
    let newOrder = new Order(data);
    await newOrder.save();

    // Retrieve current user's orders
    let currentUserOrders = await Order.find({ email: req.session.user.email });
    let orderTitles = currentUserOrders.map(order => order.title);
    let orderDescriptions = currentUserOrders.map(order => order.description);

    // Find ordered products
    let currentUserOrderedProducts = await Product.find({
      $and: [
        { title: { $in: orderTitles } },
        { description: { $in: orderDescriptions } },
      ],
    });

    console.log(currentUserOrderedProducts);

    // Render the orders page
    res.render('orders', { products: currentUserOrderedProducts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});

let connectionString = "mongodb://localhost/sp23-bse-b";
mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));