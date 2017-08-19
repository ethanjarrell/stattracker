const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  activity_type: {
    type: String,
  },
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category