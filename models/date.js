const mongoose = require('mongoose');

let Schema = mongoose.Schema;

    const datesSchema = new mongoose.Schema({
      date: {
        type : Date,
        default : Date.now
      },
      activity: {
        type: Number,
        ref: 'Activity',
        required: true
  }

})

const Dates = mongoose.model('Dates', datesSchema);

module.exports = Dates
