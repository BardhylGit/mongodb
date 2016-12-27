    // ============================
    // get the packages we need ===
    // ============================

    var express = require("express");
    var bodyParser = require("body-parser");
    var morgan = require("morgan");
    var mongoose = require("mongoose");

    var app = express();

    var jwt = require("jsonwebtoken"); // used to create, signin and verify tokens
    var config = require("./config.js"); // get our config file
    var User = require("./app/models/user.js"); // get our mongoose model

    // API ROUTES -------------------

    // get an instance of the router for api routes
    var apiRoutes = express.Router();



    // ==================
    // Configuration ====
    // ==================

    var host = "https://" + process.env.IP || +process.env.IP || +"127.0.0.1";
    var port = process.env.port || 8081;
    mongoose.connect(config.database);
    app.set("supperSecret", config.secret);

    // use body parser so we can get info from POST and /or URL parameters
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());

    //  use morgan to log requests in console
    app.use(morgan("dev"));

    app.use(function(req, res) {
        // console.log(req);
        req.next();
    });


    //  ===========
    // routes =====
    // ============

    // basic route
    app.get("/", function(req, res) {
        res.send('API is listening at http://localhost:' + port + "/api");
    });

    app.get('/setup', function(req, res) {

        // create a sample user
        var nick = new User({
            name: 'Nick Cerminara',
            password: 'password',
            admin: true
        });


        // save the sample user
        nick.save(function(err) {
            if (err) throw err;

            console.log('User saved successfully');
            res.json({
                success: true,
                createdUser: nick
            });
        });
    });
    
    // unprotected route because it is above te middleware
    apiRoutes.post('/authenticate', function(req, res) {

        // find the user
        User.findOne({
            name: req.body.name
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            }
            else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                }
                else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, config.secret, {
                        expiresIn : 60*60*24 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
    });


    // route middleware to verify a token
    apiRoutes.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                }
                else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        }
        else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });
    
    // route to show a random message (GET http://localhost:8080/api/)
    apiRoutes.get('/api', function(req, res) {
        res.json({
            message: 'Welcome to the coolest API on earth!'
        });
    });

    // route to return all users (GET http://localhost:8080/api/users)
    apiRoutes.post('/users', function(req, res) {
        User.find({}, function(err, users) {
            res.json( users );
        });
    });

    // apply the routes to our application with the prefix /api
    app.use('/api', apiRoutes);

    // =====================
    //  start the server ===
    // =====================

    app.listen(port);
    console.log('Magic happens at ' + host + ":" + port);