const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({

activity_type: mongoose.Schema.Types.Mixed,

activities: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Activity',
}],

});

categorySchema.plugin(uniqueValidator);
const Category = mongoose.model('Category', categorySchema);

module.exports = Category
