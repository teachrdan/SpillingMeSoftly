var mongoose = require('mongoose');

var connection = mongoose.createConnection({
  user: "root",
  password: "",
  database: "spills"
});

connection.connect();

module.exports = connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  var spillSchema = mongoose.Schema({
    report_number: Number,
    significant: Boolean,
    location_latitude: Number,
    location_longitude: Number
  })
});
