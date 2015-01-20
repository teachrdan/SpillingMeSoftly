var express     = require('express'),
    mongoose    = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/spills');

// configure our server with all the middleware and and routing
// require('middleware')(app, express);

// export our app for testing and flexibility, required by index.js
module.exports = app;
