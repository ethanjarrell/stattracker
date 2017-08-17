const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema({
activity_name: {
  type: String,
  lowercase: true,
  ref: '_id'
},
quantity: {
  type: Number,
  trim: true,
  required: true
},
metric: {
  type: String,
  lowercase: true
},
category: {
  type: String,
  ref: 'Category',
  unique: true,
  required: true
}
})

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity
