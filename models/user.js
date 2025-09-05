const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  description: String,
});


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  foods: [foodSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
