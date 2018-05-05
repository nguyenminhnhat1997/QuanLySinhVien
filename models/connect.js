var mongoose = require('mongoose');
var q = require('q');
var Schema = mongoose.Schema;
var UserSchema = mongoose.Schema({
	email:{
		type: String
	},
	username:{
		type: String
	},
	password:{
		type: String
	},
	admin: {
		type: Boolean
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}