const mongoose = require('mongoose');


const categorySchema = mongoose.Schema({
  name: { type: String, required: true }, 
  description: String,
});

const CategoryModel = mongoose.model('Category', categorySchema);


module.exports = CategoryModel;
