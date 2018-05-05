var mongoose = require('mongoose');
var q = require('q');
var Schema = mongoose.Schema;
var StudentSchema = mongoose.Schema({
	MaSV:{
		type: String,
		unique: true
	},
	HoTen:{
		type: String
	},
	NgaySinh:{
		type: String
	},
	GioiTinh: {
		type: String
	},
	DiaChi: { 
		type: String
	},
	Khoa: { 
		type: Number
	},
	MaLop: {
		type: String
	},
	Anh: {
		type: String
	}
});

var Student = module.exports = mongoose.model('Students', StudentSchema);

module.exports.getUserById = function(id, callback){
	Student.findById(id, callback);
}