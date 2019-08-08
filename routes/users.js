var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Kandidat = require('../models/Kandidat');

const failLoginUser = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('homepage', { msg: '' })
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// USER LOGIN HANDLER
router.post('/loginUser', (req, res) => {
  const nis = req.body.nis;

  User.findOne({ nis: nis })
    .then(pemilih => {
      if (pemilih) {
        req.session.user = pemilih;
        console.log(req.session.user);
        res.redirect('/users/dashboard');
      }
      else {
        res.render('homepage', { msg: 'USER Tidak ditemukan !!!' })
      }
    });

});

router.get('/dashboard', failLoginUser, (req, res) => {
  res.render('dashboard-user');
});

// LIST KANDIDAT
router.get('/list', failLoginUser, function (req, res, next) {
  Kandidat.find((err, docs) => {
    if (!err) {
      res.render("list-kandidat", { list: docs });
    }
    else {
      console.log('Error :' + err);
    }
  });
});

// LOOK FOR KANDIDAT'S VISI MISI
router.get('/visimisi/:id', failLoginUser, (req, res) => {
  Kandidat.find({ _id: req.params.id }, (err, docs) => {
    if (!err) {
      res.render("visimisi-page", { list: docs });
    }
    else {
      res.send(404);
    }
  });
});

// VOTE PAGE
router.get('/vote', failLoginUser, function (req, res, next) {
  Kandidat.find((err, docs) => {
    if (!err) {
      res.render("vote-page", { list: docs, status: req.session.user.status });
    }
    else {
      console.log('Error :' + err);
    }
  });
});
// VOTE HANDLER
router.get('/pilih/:id', failLoginUser, (req, res) => {

  Kandidat.findOne({ _id: req.params.id })
    .then(kandidat => {
      if (kandidat) {
        console.log(kandidat)
        var vote = kandidat.suara + 1;
        Kandidat.updateOne({ _id: kandidat._id }, { $set: { suara: vote } }, (err, result) => {
          console.log('SUCCESS MEMILIH')
        });

        User.updateOne({ nis: req.session.user.nis }, { $set: { status: true } }, (err, result) => {
          req.session.user.status = true;
          // console.log(req.session.user.status);
          res.redirect('/users/vote');
        });
      }
      else {
        console.log('Error :' + err);
      }
    });

});
module.exports = router;
