var express = require('express');
var router = express.Router();
var passport = require('../services/authentication'); //load our authentication from services
var low = require('lowdb');
var sanitizer = require('sanitizer');
var clone = require('clone');
var storage = require('lowdb/file-sync');
var db = low('../data/users.json', { storage: storage }); //loadin the data
    /* GET users listing. */
router.get('/', function(req, res) {
    res.send('pong'); //Always good to have an api reach test;
});

router.get('/me', passport.isAuthenticated, function(req,res){
  var user = db('users').find({_id: req.user._id});
  respond = clone(user);
  delete respond.password;
  res.send(respond);
});

router.post('/update', passport.isAuthenticated, function(req,res){
  var user = db('users').find({_id: req.user._id});
  var payload = req.body;
  user.name.first = sanitizer.sanitize(payload.name.first); //make sure they don't put any sneaky script tags in!
  user.name.last = sanitizer.sanitize(payload.name.last);
  user.company = sanitizer.sanitize(payload.company);
  user.email = sanitizer.sanitize(payload.email); //mainly trusting angular and html fields to ensure valid input, could use validator.js to address this if a double check is needed
  user.age = sanitizer.sanitize(payload.age);
  user.phone = sanitizer.sanitize(payload.phone);
  user.address = sanitizer.sanitize(payload.address);
  user.eyeColor = sanitizer.sanitize(payload.eyeColor);
  req.user = clone(user); //If you don't clone lowdb gets mad and deletes things when you statilize | also cheap way to update the session for the new information
  delete req.user.password; //dont send the user the password, in mongodb this would be alot easier
  delete req.user.guid; //They don't need this
  delete req.user.isActive; //or this
  res.send(req.user);
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (!user) {
            info.error = true;
            return res.send(info);
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err); }
            return res.send(user);
        });
    })(req, res, next);
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
