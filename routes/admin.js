var express = require('express');
var router = express.Router();

var User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin-login', { title: 'Login' })
});
// ADMIN LOGIN HANDLER
router.post('/loginAdmin', (req, res) => {
    var uname = req.body.uname;
    var pass = req.body.pass;

    console.log(uname);
    if( uname == 'admin' && pass == 'admin0987') {
        res.redirect('/admin/dashboard');
    }
    else{
        res.redirect('/admin');
    } 
});

router.route('/dashboard').get(function (req, res) {
    res.render('admin-dashboard');
});

router.route('/kandidat').get(function (req, res) {
    res.render('admin-kandidat');
});

router.route('/user').get(function (req, res) {
    res.render('admin-user');
});

router.route('/input-kandidat').get(function (req, res) {
    res.render('form-kandidat');
});
// Input Kandidat Handle

router.route('/input-user').get(function (req, res) {
    res.render('form-user');
});
// INPUT USER HANDLE
router.post('/inputUser', (req,res) => {
    // console.log(req.body);
    // res.redirect('/admin/dashboard');
    const { nama, nis, kelas, kelamin } = req.body;

    // Cek Data Sudah Ada atau Belum
    User.findOne({ nis: nis})
        .then( pemilih => {
            if (pemilih){
                //User Sudah Ada
                // errors.push({ msg : 'NIS sudah ada !'});
                res.redirect('/admin/input-user');
            }
            else{
                const pemilihBaru = new User({
                    nis: nis, 
                    nama: nama,
                    kelas: kelas,
                    kelamin: kelamin,
                    status : false
                });

                pemilihBaru.save().then(result => {
                    console.log(result);
                }).catch(err => {
                    console.log(err);
                });

                //Haeusa
                res.redirect('/admin/dashboard');
                console.log(pemilihBaru);
            }
        });
});
// router.get('/dashboard', (req,res) => res.render('dashboardUser'));

module.exports = router;
