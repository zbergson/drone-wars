var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  articles: Array,
  password: String,
  created_at: Date,
  updated_at: Date
});

var User = mongoose.model('User', userSchema);

module.exports = User;