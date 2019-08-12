var express = require('express');
var router = express.Router();
var multer = require('multer');
var User = require('../models/User');
var Kandidat = require('../models/Kandidat');
var Admin = require('../models/Admin')

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
    res.render('admin-login', { msg: "" })
});
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});
// ADMIN LOGIN HANDLER
router.post('/loginAdmin', (req, res, next) => {
    var uname = req.body.uname;
    var pass = req.body.pass;

    Admin.findOne({ username: uname })
        .then(admin => {
            if (admin && admin.password == pass) {
                req.session.adminUser = admin;
                console.log(req.session.adminUser);
                res.redirect('/admin/dashboard');
            }
            else {
                res.render('admin-login', { msg: "USERNAME atau PASSWORD SALAH !!!" });
            }
        });

});

// DASHBOARD ADMIN
router.get('/dashboard', failLoginAdmin, (req, res) => {
    res.render('admin-dashboard', { title: req.session.adminUser });
});

// EDIT ADMIN PAGE
router.get('/edit', failLoginAdmin, (req, res) => {
    res.render('admin-edit', { msg: "", title: req.session.adminUser })
});
// EDIT ADMIN HANDLER
router.post('/edit-admin', (req, res) => {
    const { id, uname, fullname, pass } = req.body;
    Admin.findOne({ _id: id })
        .then(admin => {
            // console.log(admin)
            if (admin && pass == admin.password) {
                Admin.updateOne({ _id: req.body.id }, { $set: { username: uname, fullname: fullname } }, (err, result) => {
                    req.session.adminUser.fullname = fullname;
                    res.redirect('/admin/dashboard');
                });
            }
            else {
                res.render("admin-edit", { msg: "PASSWORD NOT MATCH !", title: req.session.adminUser });
            }
        });
});

// CHANGE ADMIN PASSWORD PAGE
router.get('/change-pass', failLoginAdmin, (req, res) => {
    res.render('change-password', { msg: "", title: req.session.adminUser })
});
// CHANGE ADMIN PASSSWORD HANDLER
router.post('/change', (req, res) => {
    const { id, pass, repass } = req.body;
    Admin.findOne({ _id: id })
        .then(admin => {
            console.log(admin)
            if (admin && pass == repass) {
                if (pass.length < 6) {
                    res.render("change-password", { msg: "PASSWORD IS TOO SHORT !", title: req.session.adminUser });
                }
                else {
                    Admin.updateOne({ _id: req.body.id }, { $set: { password: pass } }, (err, result) => {
                        req.session.adminUser.password = pass;
                        res.redirect('/admin/dashboard');
                    });
                }
            }
            else {
                res.render("change-password", { msg: "PASSWORD NOT MATCH !", title: req.session.adminUser });
            }
        });
});
// LOOK FOR KANDIDAT'S VISI MISI
router.get('/detail/:id', failLoginAdmin, (req, res) => {
    Kandidat.find({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("detail-page", { list: docs, title: req.session.adminUser });
        }
        else {
            res.send(404);
            console.log('Error :' + err);
        }
    });
});

// PAGINATION
router.get('/user/:page', failLoginAdmin, (req, res) => {
    let perPage = 10;
    let page = req.params.page || 1;

    User
        .find({ deleteStatus:false }) // finding all documents
        .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
        .limit(perPage) // output just 10 items
        .exec((err, docs) => {
            console.log(docs)
            User.count((err, count) => { // count to calculate the number of pages
                if (err) return next(err);
                res.render('admin-user', {
                    title: req.session.adminUser,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    list: docs,
                });
            });
        });
});

// FORM INPUT
router.get('/input-user', failLoginAdmin, (req, res) => {
    res.render('form-user', { msg: "", scs: "", title: req.session.adminUser });
});

// INPUT USER HANDLE
router.post('/inputUser', (req, res) => {

    const { nama, nis, kelas, kelamin } = req.body;

    // Cek For User Data
    User.findOne({ nis: nis })
        .then(pemilih => {
            if (pemilih) {
                res.render("form-user", { msg: "NIS SUDAH ADA", title: req.session.adminUser });
            }
            else {
                const pemilihBaru = new User({
                    nis: nis,
                    nama: nama,
                    kelas: kelas,
                    kelamin: kelamin,
                    deleteStatus: false,
                    status: false
                });

                pemilihBaru.save().then(result => {
                    console.log(result);
                }).catch(err => {
                    res.send(404);
                    console.log(err);
                });

                res.redirect('/admin/user/:1');
                console.log(pemilihBaru);
            }
        });
});
// DELETE USER HANDLER
router.get('/delete-user/:id', failLoginAdmin, (req, res) => {
    User.updateOne({ _id: req.params.id }, { $set: { nis: 0, deleteStatus: true } }, (err, result) => {
        if (!err) res.redirect('/admin/user/:1');
        else res.send(404);
    });
});
// EDIT USER
router.get('/edit-user/:id', failLoginAdmin, (req, res) => {

    User.findOne({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("edit-user", { list: docs, title: req.session.adminUser });
        }
        else {
            res.send(404);
            console.log('Error :' + err);
        }
    });
});
// EDIT USER HANDLER
router.post('/editUser/:id', (req, res) => {

    const { id, nama, nis, kelas, kelamin } = req.body;
    User.findOne({ _id: id })
        .then(pemilih => {
            if (pemilih) {
                User.updateOne({ _id: req.body.id }, { $set: { nama, nis, kelas, kelamin } }, (err, result) => {
                    res.redirect('/admin/user/1');
                });
            }
            else {
                res.render("form-user", { msg: "", title: req.session.adminUser });
            }
        });
});

// KANDIDAT
router.get('/kandidat', failLoginAdmin, (req, res) => {
    Kandidat.find({ deleteStatus:false }, (err, docs) => {
        if (!err) {
            res.render("admin-kandidat", { list: docs, title: req.session.adminUser });
        }
        else {
            res.send(404);
            console.log('Error :' + err);
        }
    });
});
// INPUT KANDIDAT PAGE
router.get('/input-kandidat', failLoginAdmin, (req, res) => {
    res.render('form-kandidat', { msg: "", title: req.session.adminUser });
});
// INPUT KANDIDAT HANDLER
router.post('/inputKandidat', upload.single('kandidatImg'), (req, res) => {

    const { nama, visi, misi } = req.body;
    var foto = req.file.path;
    var status = false, suara = 0;

    // Check for Kandidat's Data
    Kandidat.findOne({ deleteStatus: false, nama: nama })
        .then(kandidat => {
            if (kandidat) {
                res.render('form-kandidat', { msg: "KANDIDAT SUDAH ADA !!!", title: req.session.adminUser });
            }
            else {
                const newKandidat = new Kandidat({
                    nama,
                    visi,
                    misi,
                    kandidatImg: foto,
                    deleteStatus: status,
                    suara: suara
                });

                newKandidat.save().then(result => {
                    console.log(result);
                }).catch(err => {
                    res.send(404);
                    console.log(err);
                });

                res.redirect('/admin/kandidat');
            }
        });
});
// DELETE KANDIDAT
router.get('/delete-kandidat/:id', failLoginAdmin, (req, res) => {

    Kandidat.updateOne({ _id: req.params.id }, { $set: { deleteStatus: true } }, (err, result) => {
        if (!err) res.redirect('/admin/kandidat');
        else res.send(404);
    });
});

// EDIT KANDIDAT PAGE
router.get('/edit-kandidat/:id', failLoginAdmin, (req, res) => {

    Kandidat.findOne({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("edit-kandidat", { list: docs, title: req.session.adminUser });
        }
        else {
            res.send(404);
            console.log('Error :' + err);
        }
    });
});
// EDIT KANDIDAT HANDLER
router.post('/editKandidat', upload.single('kandidatImg'), (req, res) => {
    // IF NOT CHANGE THE FOTO
    if (!req.file) {
        const { id, nama, visi, misi } = req.body;

        Kandidat.updateOne({ _id: id }, { $set: { nama: nama, visi: visi, misi: misi } }, (err, result) => {
            if(!err) res.redirect('/admin/kandidat');
            else res.send(404);
        });

    }
    else {
        // console.log(req.file.path);
        const { id, nama, visi, misi } = req.body;
        const foto = req.file.path;

        // console.log("ADA FILE")
        Kandidat.updateOne({ _id: id }, { $set: { nama: nama, visi: visi, misi: misi, kandidatImg: foto } }, (err, result) => {
            if(!err) res.redirect('/admin/kandidat');
            else res.send(404);
        });
    }


});

function getPostData(obj1, obj2) {
    return obj1.map(function (row) {
        var result = {};
        obj2.forEach(function (key) {
            result[key] = row[key];
        });
        return result;
    });
}

function getSuara(postData) {
    data = [];
    var i = 0;
    postData.forEach(function (content, callback) {
        for (var key in content) {
            // console.log('key: ' + key, ', value: ' + content[key]);
            if (key == 'suara') {
                data[i] = content[key];
            }
        }
        i++;
    });
    return data;
}

function getKandidat(postData) {
    data = [];
    var i = 0;
    postData.forEach(function (content, callback) {
        for (var key in content) {
            // console.log('key: ' + key, ', value: ' + content[key]);
            if (key == 'nama') {
                data[i] = content[key];
            }
        }
        i++;
    });
    return data;
}
// HASIL SUARA PAGE
// GET SUARA EVERY KANDIDATS
router.get('/hasil-suara', failLoginAdmin, (req, res) => {
    Kandidat.find({ deleteStatus: false }).then(kandidat => {
        if (kandidat) {
            // console.log(kandidat)
            // console.log("==============")

            var postData = getPostData(kandidat, ['nama', 'suara']);
            // console.log(postData);
            // console.log("==============")

            var suara = getSuara(postData);
            var kand = getKandidat(postData);

            // console.log('Kandidat : ', kand, "   Suara : ", suara);
            // console.log("==============")

            res.render('hasil-suara', { 
                dataK: JSON.stringify(kand),
                dataS: JSON.stringify(suara),
                title: req.session.adminUser
            });
        }
    });
});

module.exports = router;
