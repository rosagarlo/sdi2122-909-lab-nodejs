let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
require("./routes/songs.js")(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = function (app) {
  app.get("/songs", function (req, res) {
    let response = "";
    if(req.query.title != null && typeof (req.query.title) != "undefined")
      response = "Titulo:" + req.query.title + '<br>';
    if(req.query.author != null && typeof (req.query.author) != "undefined")
      response += "Autor:" + req.query.author;
    res.send(response);
  });
};

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
