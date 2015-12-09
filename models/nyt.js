var mongoose = require('mongoose');

var nytSchema = new mongoose.Schema({
	nyt_id: String,
	headline: String,
	summary: String,
	date: String,
	web_url: String,
  created_at: Date,
  updated_at: Date
});

var NYT = mongoose.model('NYT', nytSchema);
module.exports = NYT;