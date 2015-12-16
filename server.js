// DEPENDENCIES
require('dotenv').load();

var express      = require('express'),
    mongoose     = require('mongoose'),
    bodyParser   = require('body-parser'),
    md5          = require('md5'),
    cookieParser = require('cookie-parser'),
    port         = process.env.PORT || 3000;
    app          = express();
    http = require('http').Server(app);
    io = require('socket.io')(http);
    mongoUri     = process.env.MONGOLAB_URI || 'mongodb://localhost/drone-data';

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});



// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// LISTENER
http.listen(port);
console.log('===== Connecting to DB ... =====', mongoUri);
mongoose.connect(mongoUri);

// Models
var User = require('./models/user');
var Article = require('./models/article');
var NYT = require('./models/nyt');

//================
// Sign Up
//================

app.post('/users', function(req,res){

  var password_hash = md5(req.body.password);

  var user = new User({
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: password_hash
  });
  console.log(user)

  user.save(function(err) {
    if (err){
      console.log(err);
      res.statusCode = 503;
    }else{

      res.cookie("loggedinId", user.id);

      res.send({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at : user.created_at
      });
    }
  });
});

//================
// Login
//================
app.post('/login', function(req,res){

  var requestEmail = req.body.email;
  var requestPassword = req.body.password;
  User.findOne({"email": requestEmail}).exec(function(err, user){
    var requestPasswordHash = md5(requestPassword);
    if( user != null && requestPasswordHash == user.password){
      res.cookie("loggedinId", user.id);
      res.send({
        id: user.id,
        username: user.username
      });
    } else {
      res.status(400);
      res.send("authorization did not work");
    }
  });

});


//================
// Edit user
//================
app.put('/users/:id', function(req, res){
  password_hash = md5(req.body.password_hash);
  var userEdit = {
    email: req.body.edited_email,
    username: req.body.edited_username,
    first_name: req.body.edited_first_name,
    last_name: req.body.edited_last_name
  };

  User.findOneAndUpdate({_id: req.params.id}, userEdit, function(err,user){
    console.log(user);
    res.send(user);
  });

})


//================
// Delete user
//================


app.delete('/users/:id', function(req, res){

  User.findOneAndRemove( {_id: req.params.id},function(err){
    res.send("user deleted");
  });
});

//=============================
// Create drone strike articles
//=============================

app.post('/users/:id/articles', function(req, res){
  var article = new Article({
    town: req.body.town,
    country: req.body.country,
    date: req.body.date,
    narrative: req.body.narrative,
    deaths: req.body.deaths,
    article_link: req.body.article
  });
  article.save( function(err){
    if(err) {
      console.log(err);
    } else {
      res.send({
        town: article.town,
        narrative: article.narrative,
        deaths: article.deaths,
        country: article.country,
        article_link: article.article_link,
        date: article.date
      });
      User.findById(req.params.id).exec(function(err, user){
        console.log(user);
        user.articles.push(article);
        user.save();
      });
    };
  });
});

//=================================
// Create nyt drone strike articles
//=================================

app.post('/users/:id/nyt', function(req, res){
  var nyt_article = new NYT({
    nyt_id: req.body.id,
    headline: req.body.headline,
    date: req.body.date,
    summary: req.body.summary,
    web_url: req.body.web_url
  });
  nyt_article.save(function(err){
    if(err) {
      console.log(err);
    } else {
      res.send({
        headline: nyt_article.headline,
        date: nyt_article.date,
        summary: nyt_article.summary,
        web_url: nyt_article.web_url
      });
      User.findById(req.params.id).exec(function(err, user){
        user.nyt.push(nyt_article);
        console.log(user);
        user.save();
      });
    };
  });
});

//===========================
// Retrieve User articles
//===========================
app.get('/users/:id', function(req, res) {
  User.findById(req.params.id).exec(function(err, user) {
    if (err) {
      console.log(err);
      res.statusCode = 503;
    } else {
      
      res.send({
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: user.password_hash,
        articles: user.articles,
        nyt: user.nyt
      })
    };
  });
});


//============================
// Delete dronestream articles
//============================

app.delete('/users/:id/articles/:article_id', function(req, res){
  // Article.findById(req.params.article_id).remove(function(err, article){
  //   if(err){
  //     console.log(err);
  //   }
  // });

  User.findById(req.params.id).then(function(user, err){

    user.articles.forEach(function(article){
      if(article._id == req.params.article_id){
        var index = user.articles.indexOf(article);
        console.log('==============' + index);
        user.articles.splice(index, 1);
        user.save();
       
        res.send(user);
      }

      else {
        console.log(err);
      }
    });
  });

});

//============================
// Delete nyt articles
//============================

app.delete('/users/:id/nyt/:article_id', function(req, res){
  // NYT.findById(req.params.article_id).remove(function(err, article){
  //   if(err){
  //     console.log(err);
  //   }
  // });

  User.findById(req.params.id).then(function(user, err){
    user.nyt.forEach(function(story){
      if(story._id == req.params.article_id){
        console.log(story);
        var index = user.nyt.indexOf(story);
        console.log('=======================' + story._id + '   ' + req.params.article_id + ' ' + index );
        user.nyt.splice(index, 1);
        user.save();
        // console.log(user);
        res.send(user);
      }
      else {
        console.log(err);
      }
    });
  });

});

//================
// Search Twitter
//================

// client.stream('statuses/filter', {track: 'drone'}, function(stream) {
//   stream.on('data', function(tweet) {
//     io.emit('drone-tweets', tweet);
//   });
 
//   stream.on('error', function(error) {
//     console.log(error);
//     throw error;

//   });
// });


