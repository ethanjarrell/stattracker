const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const datesSchema = new mongoose.Schema({

  date: {
    type: Date,
    default: Date.now
  },
})

const Dates = mongoose.model('Dates', datesSchema);

module.exports = Dates
