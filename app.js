var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moongose = require('mongoose');
var session = require('express-session');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

// DB Config
const db = require('./database/database').MongoURI;
moongose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connection success'))
  .catch(err => console.log(err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'evotte',
  resave: false,
  saveUninitialized: true
}));
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

//Jalanin router
app.use('/', usersRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 8080)

module.exports = app;
