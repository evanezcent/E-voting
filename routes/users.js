var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Kandidat = require('../models/Kandidat');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('homepage', { title: 'Homepage' })
});

// USER LOGIN HANDLER
router.post('/loginUser', (req, res) => {
  const nis = req.body.nis;

  User.findOne({ nis: nis })
    .then(pemilih => {
      if (pemilih) {
        res.redirect('/users/dashboard');
      }
      else {
        res.redirect('/');
      }
    })

});

router.route('/dashboard').get(function (req, res) {
  res.render('dashboardUser');
});


// router.get('/dashboard', (req,res) => res.render('dashboardUser'));

router.get('/vote', function (req, res, next) {
  Kandidat.find((err, docs) => {
    if (!err) {
      res.render("vote-page", { list: docs });
    }
    else {
      console.log('Error :' + err);
    }
  });
});

router.get('/list', function (req, res, next) {
  Kandidat.find((err, docs) => {
    if (!err) {
      res.render("list-kandidat", { list: docs });
    }
    else {
      console.log('Error :' + err);
    }
  });
});

router.get('/visimisi', function (req, res, next) {
  res.render('visimisi-page', { title: 'Visi Misi' })
});
module.exports = router;
