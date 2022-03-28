let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const {MongoClient} = require("mongodb");
const url = "mongodb://admin:sdi@tiendamusica-shard-00-00.xyhss.mongodb.net:27017,tiendamusica-shard-00-01.xyhss.mongodb.net:27017,tiendamusica-shard-00-02.xyhss.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ko1y1k-shard-0&authSource=admin&retryWrites=true&w=majority";

app.set('connectionStrings', url);

require("./routes/songs.js")(app, MongoClient);
require("./routes/authors.js")(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
