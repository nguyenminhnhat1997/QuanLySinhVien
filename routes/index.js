var express = require('express');
var router = express.Router();
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
var q = require('q');
var User = require('../models/connect');
var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
// Get Homepage
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


router.get('/login', function(req, res, next) {
	res.render('partials/login', {'data': false});
});

router.get('/register',(req,res)=>{
	res.render('partials/register', {'data': false});
});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'Bạn đã đăng xuất thành công');

	res.redirect('/login');
});

router.post('/register', (req, res,next)=>{
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var confirm_password = req.body.confirm_password;

	req.checkBody('email','Email không hợp lệ !').isEmail();
	req.checkBody('username','Username không được để trống !').notEmpty();
	req.checkBody('password','Password không được để trống !').notEmpty();
	req.checkBody('confirm_password','Password không khớp !').equals(req.body.password);
	var arrError = req.validationErrors();
	if(arrError){
		console.log(arrError);
		res.render('partials/register',{data: arrError});
	}else{

		User.findOne({username:{"$regex": "^" + username + "\\b", "$options": "i"}}
			,(err,user)=>{
				User.findOne({ email: {"$regex": "^" + email + "\\b", "$options": "i"}}
					,(err,mail)=>{
						if(user || mail){
							res.render('partials/register', {
								user: user,
								mail: mail
							});
						}else{
							var objectUser = User({
								'email':email,
								'username': username,
								'password': password
							});
							bcrypt.hash(objectUser.password, saltRounds, function(err, hash) {
								objectUser.password = hash;
								objectUser.save((err, success)=>{
									if(err){
										res.render('partials/register',{data: arrError});
									}else{
										res.render('partials/login',{data: "Bạn có thể đăng nhập ngay !"})
									}
								});
							});
						}
					})

			})

	}
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			bcrypt.compare(password, user.password, function(err, isMatch) {
				if(err) throw err;
				if(isMatch){
					console.log("Login ok");
					return done(null, user);
				}else{
					console.log("Login false");
					return done(null, false, { message: 'Incorrect password.' });
				}
			});
		});
	}
	));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local',{successRedirect: '/', failureRedirect: '/login', failureFlash: true}),
	function(req, res) {
		res.redirect('/');
	});


module.exports = router;
