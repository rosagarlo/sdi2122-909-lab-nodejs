let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();
let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload(
    {
        limits: {fileSize: 50 * 1024 * 1024},
        createParentPath: true
    }));

app.set('uploadPath', __dirname)
app.set('clave', 'abcdefg');
app.set('crypto', crypto);

let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const {MongoClient} = require("mongodb");
const url = "mongodb://admin:TnyorDwXLLLQrQUN@tiendamusica-shard-00-00.xyhss.mongodb.net:27017,tiendamusica-shard-00-01.xyhss.mongodb.net:27017,tiendamusica-shard-00-02.xyhss.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ko1y1k-shard-0&authSource=admin&retryWrites=true&w=majority";

app.set('connectionStrings', url);

// Antes de los controladores de /users y /songs
const userSessionRouter = require('./routes/userSessionRouter');
const userAuthorRouter = require('./routes/userAuthorRouter');
app.use("/songs/edit", userAuthorRouter);
app.use("/songs/delete", userAuthorRouter);

const userAudiosRouter = require('./routes/userAudiosRouter');

app.use("/songs/add", userSessionRouter);
app.use("/publications", userSessionRouter);
app.use("/songs/buy", userSessionRouter);
app.use("/purchases", userSessionRouter);
app.use("/audios/", userAudiosRouter);
app.use("/shop/", userSessionRouter)

let commentsRepository = require("./repositories/commentsRepository.js");
commentsRepository.init(app, MongoClient);
let songsRepository = require("./repositories/songsRepository.js"); // los repositorios deben estar definidos ANTES que los controladores
songsRepository.init(app, MongoClient);
const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, MongoClient);

let indexRouter = require('./routes/index');
require("./routes/users.js")(app, usersRepository);
require("./routes/comments.js")(app, commentsRepository);
require("./routes/songs.js")(app, songsRepository, commentsRepository);
require("./routes/authors.js")(app);
require("./routes/api/songsAPIv1.0.js")(app, songsRepository);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    console.log("Se ha producido un error " + err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
