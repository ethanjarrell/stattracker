const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const datesSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  activity: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }],

})

const Dates = mongoose.model('Dates', datesSchema);

module.exports = Dates
