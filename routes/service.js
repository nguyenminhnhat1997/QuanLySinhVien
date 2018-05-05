var express = require('express');
var router = express.Router();
var User = require('../models/connect');
var multer = require('multer');
var path = require('path');
var Student = require('../models/connect_students');
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file,cb){
		cb(null,file.fieldname + '-'+ Date.now()+path.extname(file.originalname));
	}
});

const upload = multer({storage:storage});

router.get('/', ensureAuthenticated, function(req, res){
	res.render('index',{'data': req.user});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

router.get('/see', ensureAuthenticated,(req,res,next)=>{
	
	res.render('partials/service/see',{see: "active"})
});

router.get('/find', ensureAuthenticated,(req,res,next)=>{
	res.render('partials/service/find',{find: "active"})
});

router.get('/add', ensureAuthenticated,(req,res,next)=>{
	res.render('partials/service/input',{input: "active"})
});

router.post("/add",upload.single('img_upload'),(req,res,next)=>{
	var MaSV = req.body.MaSV;
	var HoTen = req.body.HoTen;
	var NgaySinh = req.body.NgaySinh;
	var GioiTinh = req.body.GioiTinh;
	var DiaChi = req.body.DiaChi;
	var Khoa = req.body.Khoa;
	var MaLop = req.body.MaLop;

	req.checkBody('MaSV', 'Mã sinh viên không được để trống').notEmpty();
	req.checkBody('HoTen', 'Họ tên không được để trống').notEmpty();
	req.checkBody('NgaySinh', 'Ngày sinh viên không được để trống').notEmpty();
	req.checkBody('DiaChi', 'Địa chỉ viên không được để trống').notEmpty();
	var arrError = req.validationErrors();

	if(req.file){
		console.log("Upload file ");
		var filename = req.file.filename;
	}else{
		console.log("No upload file");
		var filename = 'noimage.jpg';
	}

	if(arrError){
		console.log('err!');
		res.render('service/add',{errors: arrError});
	}else{
		Student.findOne({MaSV:{"$regex": "^" + MaSV + "\\b", "$options": "i"}},(err,student)=>{
			if(student){
				res.render('partials/service/input',{student: student});
			}else{
				var objectStudent = Student({
					MaSV: MaSV,
					HoTen: HoTen,
					NgaySinh: NgaySinh,
					DiaChi: DiaChi,
					Khoa:Khoa,
					MaLop: MaLop,
					Anh: filename});
				objectStudent.save((err, profile)=>{
					if(err) throw err;
					req.flash('success_msg','Thêm thành công');
					res.location('/service/add');
					res.redirect('/service/add');
				})
			}/*end else*/
		})

		
	}
})

module.exports = router;