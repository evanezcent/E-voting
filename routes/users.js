var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('homepage',{title: 'Homepage'})
});

router.route('/dashboard').get(function(req,res){
  res.render('dashboardUser');
});


// router.get('/dashboard', (req,res) => res.render('dashboardUser'));

router.get('/vote', function(req, res, next) {
  res.render('vote-page',{title: 'Vote'})
});

module.exports = router;
