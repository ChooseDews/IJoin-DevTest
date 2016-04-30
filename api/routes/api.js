var express = require('express');
var router = express.Router();
var passport = require('../services/authentication'); //load our authentication from services
var low = require('lowdb');
var sanitizer = require('sanitizer');
var clone = require('clone');
var storage = require('lowdb/file-sync');
var db = low('../data/users.json', { storage: storage }); //loadin the data
var validator = require('validator');
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

  if(payload.name.first){
    user.name.first = sanitizer.sanitize(payload.name.first); //make sure they don't put any sneaky script tags in!
  }
  if(payload.name.last){ //Don't let them delete there name
    user.name.last = sanitizer.sanitize(payload.name.last); //make sure they don't put any sneaky script tags in!
  }
  user.company = sanitizer.sanitize(payload.company);
  if(payload.email && validator.isEmail(sanitizer.sanitize(payload.email))){ //Email is important makes sure we have it, this ensures we never save a "half" email
        user.email = sanitizer.sanitize(payload.email);
  }
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
