var express = require('express');
var router = express.Router();
var multer = require('multer');
var User = require('../models/User');
var Kandidat = require('../models/Kandidat');

const failLoginAdmin = (req, res, next) => {
    if (!req.session.adminUser) {
        res.redirect('/admin');
    } else {
        next();
    }
}

// IMAGE UPLOADER
var upload = multer({
    storage: multer.diskStorage({

        destination: function (req, file, callback) { callback(null, './uploads'); },
        filename: function (req, file, callback) { callback(null, file.originalname); }
    })
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin-login')
});
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});
// ADMIN LOGIN HANDLER
router.post('/loginAdmin', (req, res, next) => {
    var uname = req.body.uname;
    var pass = req.body.pass;

    // console.log(uname);
    if (uname == 'admin' && pass == 'admin0987') {
        req.session.adminUser = uname;
        res.redirect('/admin/dashboard');
        console.log(req.session);
    }
    else {
        res.redirect('/admin');
    }
});

router.get('/dashboard', failLoginAdmin, (req, res) => {
    res.render('admin-dashboard', { title: req.session.adminUser });
});

router.get('/detail/:id', failLoginAdmin, (req, res) => {
    Kandidat.find({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("visimisi-page", { list: docs, title: req.session.adminUser });
        }
        else {
            console.log('Error :' + err);
        }
    });
});

router.get('/user', failLoginAdmin, (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("admin-user", { list: docs, title: req.session.adminUser });
        }
        else {
            console.log('Error :' + err);
        }
    });
});
router.get('/input-user', failLoginAdmin, (req, res) => {
    res.render('form-user', { msg: "", scs: "", title: req.session.adminUser });
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
                // errors.push({ msg : "NIS sudah ada !"});
                res.render("form-user", { msg: "NIS SUDAH ADA", title: req.session.adminUser });
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
                res.render('form-user', { msg: "", title: req.session.adminUser });
                console.log(pemilihBaru);
            }
        });
});
// DELETE USER
router.get('/delete-user/:id', failLoginAdmin, (req, res) => {
    User.updateOne({ _id: req.params.id }, { $set: { status: true } }, (err, result) => {
        res.redirect('/admin/user');
    });
});
// EDIT USER
router.get('/edit-user/:id', failLoginAdmin, (req, res) => {

    User.findOne({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("edit-user", { list: docs, title: req.session.adminUser });
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
    User.findOne({ nis: nis })
        .then(pemilih => {
            if (pemilih) {
                //User Sudah Ada
                // errors.push({ msg : "NIS sudah ada !"});
                res.render("form-user", { msg: "NIS SUDAH ADA", title: req.session.adminUser });
            }
            else {
                User.updateOne({ _id: req.body.id }, { $set: { nama, nis, kelas, kelamin } }, (err, result) => {
                    res.redirect('/admin/user');
                });
            }
        });
});

// KANDIDAT
router.get('/kandidat', failLoginAdmin, (req, res) => {
    Kandidat.find((err, docs) => {
        if (!err) {
            res.render("admin-kandidat", { list: docs, title: req.session.adminUser });
        }
        else {
            console.log('Error :' + err);
        }
    });
});
router.get('/input-kandidat', failLoginAdmin, (req, res) => {
    res.render('form-kandidat', { msg: "", title: req.session.adminUser });
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
                res.render('form-kandidat', { msg: "KANDIDAT SUDAH ADA !!!", title: req.session.adminUser });
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
// DELETE KANDIDAT
router.get('/delete-kandidat/:id', failLoginAdmin, (req, res) => {
    // console.log(req.body);
    // res.redirect('/admin/dashboard');
    var deleteStatus = true;
    Kandidat.updateOne({ _id: req.params.id }, { $set: { deleteStatus: true } }, (err, result) => {
        res.redirect('/admin/kandidat');
    });
});

// EDIT KANDIDAT
router.get('/edit-kandidat/:id', failLoginAdmin, (req, res) => {

    Kandidat.findOne({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("edit-kandidat", { list: docs, title: req.session.adminUser });
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

    Kandidat.findOne({ nama: nama })
        .then(kandidat => {
            if (kandidat) {
                //User Sudah Ada
                // errors.push({ msg : 'NIS sudah ada !'});
                res.render('form-kandidat', { msg: "KANDIDAT SUDAH ADA !!!", title: req.session.adminUser });
            } else {
                Kandidat.updateOne({ _id: req.body.id }, { $set: { nama: nama, visi: visi, misi: misi, kandidatImg: foto } }, (err, result) => {
                    res.redirect('/admin/kandidat');
                });
            }
        });
});
module.exports = router;
