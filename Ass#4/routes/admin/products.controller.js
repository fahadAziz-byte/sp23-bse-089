const express = require("express");
let router = express.Router();
let multer = require("multer");
let Product = require("../../model/productModel");
const Category = require("../../model/categoryModel");
router.use(express.urlencoded({extended:true}))
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage: storage });



// route to handle Delete of product
router.get("/products/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");
});


//route to render edit product form
router.get("/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  let categories=await Category.find();
  return res.render("admin/products/product-edit-form.ejs", {
    layout: "adminlayout",
    product,
    categories
  });
});
router.post("/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  product.title = req.body.title;
  product.description = req.body.description;
  product.category=req.body.category;
  product.price = req.body.price;
  await product.save();
  return res.redirect("/admin/products");
});

// route to render create product form
router.get("/products/create", async(req, res) => {
  let categories=await Category.find();
  return res.render("admin/products/product-form", { layout: "adminlayout",categories });
});

//route to handle create product form submission
// demonstrates PRG Design Pattern (Post Redirect GET)
router.post(
  "/products/create",
  upload.single("file"),
  async (req, res) => {
    let data = req.body;
    let newProduct = new Product(data);
    if (req.file) {
      newProduct.picture = req.file.filename;
    }
    await newProduct.save();
    return res.redirect("/admin/products");
  }
);

router.get('/category',async(req,res)=>{
  let categories=await Category.find();

  res.render("admin/category/category", {
    layout: "adminlayout",
    categories,
  });
});

router.get("/categories/new",async(req,res)=>{
  res.render("admin/category/category-new-form", {
    layout: "adminlayout"
  })
})

router.post("/categories/new",async(req,res)=>{
  let data = req.body;
  let doesCategoryExist=await Category.findOne({name : data.name});
  if(doesCategoryExist){
    return res.render("admin/category/category-new-form", {
      layout: "adminlayout"
      ,message:'Category Already Exist'
    })
  }
  let newCategory=new Category(data);
  await newCategory.save();
  res.redirect('/admin/category');
})





router.get("/products/:page?", async (req, res) => {
  let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 1;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  // return res.send({ page });
  let products = await Product.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
    page,
    pageSize,
    totalPages,
    totalRecords,
  });
});

module.exports = router;