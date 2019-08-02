var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin-login', { title: 'Homepage' })
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

router.route('/input-user').get(function (req, res) {
    res.render('form-user');
});

// router.get('/dashboard', (req,res) => res.render('dashboardUser'));

module.exports = router;
