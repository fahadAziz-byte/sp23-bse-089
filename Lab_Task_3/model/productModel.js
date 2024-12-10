const mongoose=require('mongoose');

let productSchema=new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
})

let productModel=new mongoose.model('Prroducts',productSchema);
module.exports=productModel;