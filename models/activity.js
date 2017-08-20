const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema({

category : {
  type: mongoose.Schema.Types.Mixed,
  ref: 'Category'
},

activity_name: mongoose.Schema.Types.Mixed,

quantity: Number,

metric: mongoose.Schema.Types.Mixed,

});

activitySchema.plugin(uniqueValidator);
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity
