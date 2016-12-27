// server.js

// set up ========================
var express = require('express');
var app = express();

// mongoose for mongodb
var mongoose = require('mongoose');

// log requests to the console (express4)
var morgan = require('morgan');

// pull information from HTML POST (express4)
var bodyParser = require('body-parser');

// simulate DELETE and PUT (express4)
var methodOverride = require('method-override');

var config = require('./config');

var host = 'https://' + process.env.IP || + "127.0.0.1";
var port = process.env.port || 8081;


// configuration =================
// connect to mongoDB database on modulus.io
mongoose.connect(config.database);

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// log every request to the console
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    'extended': 'false'
}));

// // parse application/json
// app.use(bodyParser.json());

// // parse application/vnd.api+json as json
// app.use(bodyParser.json({
//     type: 'application/vnd.api+json'
// }));

app.use(function(req, res) {
   console.log(req);
   req.next();
});

// app.use(methodOverride());



// listen (start app with node server.js) ======================================
app.listen(port);
console.log('App listening on ' + host + '/' + port);