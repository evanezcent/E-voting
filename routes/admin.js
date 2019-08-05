var express = require('express');
var router = express.Router();
var multer = require('multer');
var User = require('../models/User');
var Kandidat = require('../models/Kandidat');

// IMAGE UPLOADER

var upload = multer({
    storage: multer.diskStorage({

        destination: function (req, file, callback) { callback(null, './uploads'); },
        filename: function (req, file, callback) { callback(null, file.originalname); }
    })
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin-login', { title: 'Login' })
});
// ADMIN LOGIN HANDLER
router.post('/loginAdmin', (req, res) => {
    var uname = req.body.uname;
    var pass = req.body.pass;

    console.log(uname);
    if (uname == 'admin' && pass == 'admin0987') {
        res.redirect('/admin/dashboard');
    }
    else {
        res.redirect('/admin');
    }
});

router.route('/dashboard').get(function (req, res) {
    res.render('admin-dashboard');
});

router.route('/kandidat').get(function (req, res) {
    Kandidat.find((err, docs) => {
        if (!err) {
            res.render("admin-kandidat", { list: docs });
        }
        else {
            console.log('Error :' + err);
        }
    });
});

router.route('/detail/:id').get(function (req, res) {
    Kandidat.find({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("visimisi-page", { list: docs });
        }
        else {
            console.log('Error :' + err);
        }
    });
});

router.route('/user').get(function (req, res) {
    User.find((err, docs) => {
        if (!err) {
            res.render("admin-user", { list: docs });
        }
        else {
            console.log('Error :' + err);
        }
    });
});

router.route('/input-kandidat').get(function (req, res) {
    res.render('form-kandidat');
});
// Input Kandidat Handle
router.post('/inputKandidat', upload.single('kandidatImg'), (req, res) => {
    // console.log(req.body);
    console.log(req.file);
    // res.redirect('/admin/dashboard');
    const { nama, visi, misi } = req.body;
    var foto = req.file.path;
    var status = false, suara = 0;

    // Cek Data Sudah Ada atau Belum
    Kandidat.findOne({ nama: nama })
        .then(kandidat => {
            if (kandidat) {
                //User Sudah Ada
                // errors.push({ msg : 'NIS sudah ada !'});
                res.redirect('/admin/input-kandidat');
            }
            else {
                const newKandidat = new Kandidat({
                    nama,
                    visi,
                    misi,
                    kandidatImg: foto,
                    deleteStatus: status,
                    suara
                });

                newKandidat.save().then(result => {
                    console.log(result);
                }).catch(err => {
                    console.log(err);
                });

                //Haeusa
                res.redirect('/admin/kandidat');
                console.log(pemilihBaru);
            }
        });
});

router.route('/input-user').get(function (req, res) {
    res.render('form-user');
});
// INPUT USER HANDLE
router.post('/inputUser', (req, res) => {
    // console.log(req.body);
    // res.redirect('/admin/dashboard');
    const { nama, nis, kelas, kelamin } = req.body;

    // Cek Data Sudah Ada atau Belum
    User.findOne({ nis: nis })
        .then(pemilih => {
            if (pemilih) {
                //User Sudah Ada
                // errors.push({ msg : 'NIS sudah ada !'});
                res.redirect('/admin/input-user');
            }
            else {
                const pemilihBaru = new User({
                    nis: nis,
                    nama: nama,
                    kelas: kelas,
                    kelamin: kelamin,
                    status: false
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
// DELETE USER
router.get('/delete-user/:id', (req, res) => {
    User.updateOne({ _id: req.params.id }, { $set: { status: true } }, (err, result) => {
        res.redirect('/admin/dashboard');
    });
});
// EDIT USER
router.get('/edit-user/:id', (req, res) => {

    User.findOne({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("edit-user", { list: docs });
        }
        else {
            console.log('Error :' + err);
        }
    });
});
// EDIT USER HANDLER
router.post('/editUser/:id', (req, res) => {
    // console.log(req.file);
    const { nama, nis, kelas, kelamin } = req.body;

    User.updateOne({ _id: req.body.id }, { $set: { nama, nis, kelas, kelamin } }, (err, result) => {
        res.redirect('/admin/user');
    });
});

// DELETE KANDIDAT
router.get('/delete-kandidat/:id', (req, res) => {
    // console.log(req.body);
    // res.redirect('/admin/dashboard');
    var deleteStatus = true;
    Kandidat.updateOne({ _id: req.params.id }, { $set: { deleteStatus: true } }, (err, result) => {
        res.redirect('/admin/dashboard');
    });
});
// EDIT KANDIDAT
router.get('/edit-kandidat/:id', (req, res) => {

    Kandidat.findOne({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("edit-kandidat", { list: docs });
        }
        else {
            console.log('Error :' + err);
        }
    });
});

// EDIT KANDIDAT HANDLE
router.post('/editKandidat', upload.single('kandidatImg'), (req, res) => {
    console.log(req.file);
    const { nama, visi, misi } = req.body;
    var foto = req.file.path;

    Kandidat.updateOne({ _id: req.body.id }, { $set: { nama: nama, visi: visi, misi: misi, kandidatImg: foto } }, (err, result) => {
        res.redirect('/admin/kandidat');
    });
});
module.exports = router;
