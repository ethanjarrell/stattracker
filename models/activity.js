const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema({
  activity_name: {
    type: String,
    lowercase: true,
  },
  quantity: {
    type: Number,
    trim: true,
    required: true,
  },
  metric: {
    type: String,
    lowercase: true,
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  date: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dates'
  }],
})

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity