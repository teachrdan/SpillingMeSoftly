var express = require('express');
var handler = require('./lib/request-handler.solution');
var app = express();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.session());
});

module.exports = app;
