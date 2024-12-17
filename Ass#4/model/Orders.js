const mongoose=require('mongoose');

let orderSchema=mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    email: String,
})

let ordersModel=mongoose.model("Order",orderSchema);
module.exports=ordersModel;