const mongoose=require('mongoose');

let orderSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    picture: String,
    email: String,
    date: {
        type: Date,
        default: Date.now()
    },
    address: {
        fullName: String,
        street: String,
        city: String,
        postalCode: String
    }
})

let ordersModel=mongoose.model("Order",orderSchema);
module.exports=ordersModel;