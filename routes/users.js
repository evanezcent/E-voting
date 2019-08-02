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

router.get('/list', function(req, res, next) {
  res.render('list-kandiat',{title: 'List Kandidat'})
});

router.get('/visimisi', function(req, res, next) {
  res.render('visimisi-page',{title: 'Visi Misi'})
});
module.exports = router;
