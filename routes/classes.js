var express = require('express');
var router = express.Router();
var User = require('../models/connect');
/* GET home page. */
router.get('/', function(req, res, next) {
  User.getClasses(function(err, classes ){
  	res.render('classes/index', {'classes': classes});
  }, 3);
});

router.get('/:id/detail',function(req, res, next){
	var id = req.params.id;
	User.getClassesById( [req.params.id], function(err, data){
		if(err) throw err;
		console.log(data);
		res.location('classes/detail');
		res.render('classes/detail', {'dataOject': data});
	})
})

module.exports = router;
