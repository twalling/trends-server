var env = process.env.NODE_ENV || 'development';
var path = require('path');
var express = require('express');
var common = require('trends-common');
var config = common.config[env];
var Post = common.models.Post;

var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || config.port);
  app.set('views', path.join(__dirname, '/views'));
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express['static'](path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
  Post.findMostRecent(function(err, results) {
    if (err) {
      console.log(err);
      return res.send(500, 'error retrieving results');
    }
    res.render('index', {
      posts: results
    });
  });
});

common.lib.mongo.connectToMongo(config.mongodb, function(err) {
  if (err) {
    throw err;
  }
  console.log('Connected to Mongo');
});

app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
