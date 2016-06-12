// load the things we need
var mongoose = require('mongoose');

var routeSchema = mongoose.Schema({
	_creator 	 : { type: String, ref: 'User' },
    name         : String,
    time         : Number,
    distance     : Number,
    consumption  : Number,
    locations	 : [String]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Route', routeSchema, 'routes');