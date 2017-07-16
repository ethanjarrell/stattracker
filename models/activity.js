const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const activitySchema = new Schema({
      activity_name: String,
      quantity: Number,
      date: { type: Date, default: Date.now }
    })


const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity
