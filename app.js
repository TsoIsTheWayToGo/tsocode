const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');



const expressValidator = require('express-validator');

const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

require('./passport')
const config = require('./config');


mongoose
  .connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
global.User = require('./models/user');


const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoute);
app.use('/', authRoute);
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: true}
}));


app.use(passport.initialize());
app.use(passport.session())
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
