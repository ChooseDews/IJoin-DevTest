var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./services/authentication')
var api = require('./routes/api');
var app = express();

app.set('views', path.join(__dirname, 'views')); //Views really only being used for error reporting/stack trace
app.set('view engine', 'ejs');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret: 'omg such sercret much wow', //clusters would use redis here but this is super simple
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join('../client/')));


app.use('/api', api); //Respond to all api requests from client. in api router
app.use('/*', express.static('../client/')); //Serve Everything to the client from the /client folder



/// handle errors and stacktrace

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


module.exports = app;
