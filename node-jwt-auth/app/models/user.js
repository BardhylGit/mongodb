// get an instance of mongoose and mongoose.Schema

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// set up an mongoose model and pass it using mongoose.exports
module.exports = mongoose.model('User', new Schema({
        name: String,
        password: String,
        admin: Boolean
}));