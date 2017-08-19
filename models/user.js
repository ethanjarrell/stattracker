const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
})

userSchema.pre('save', function(next) {
  var hash = bcrypt.hashSync(this.password, 8);
  this.password = hash;
  next();
})
const User = mongoose.model('User', userSchema);

module.exports = User;