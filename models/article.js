var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
  town: String,
  country: String,
  narrative: String,
  date: String,
  deaths: Number,
  article_link: String,
  created_at: Date,
  updated_at: Date
});

var Article = mongoose.model('Article', articleSchema);
module.exports = Article;