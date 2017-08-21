const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({

activity_type: {
  type: String,
},

activities : [{
  type: mongoose.Schema.Types.ObjectId,
  activity_name: String,
  quantity: Number,
  metric: String,
  ref: 'Activity'
}],

});

categorySchema.plugin(uniqueValidator);
const Category = mongoose.model('Category', categorySchema);

module.exports = Category
