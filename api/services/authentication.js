//
// Using passport-local we authentcate the user
//
//
//
//

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var low = require('lowdb');
var storage = require('lowdb/file-sync');
var db = low('../data/users.json', { storage: storage });
var clone = require('clone');

passport.serializeUser(function(user, done) {
   delete user.password; //They dont need to see all this
   delete user.guid;
   delete user.isActive;
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.isAuthenticated = function(req, res, next) { //Important middlewear which handles all the authentication
  if (req.isAuthenticated())
    return next(); // User is logged in
  else
    res.send('NOT AUTHENTICATED'); //triggers client app to require a new login when this is sent back
}

passport.use(new LocalStrategy(
  function(username, password, done) {
        dbuser = db('users').find({email: username});
        user = clone(dbuser); //clone so the data doesn't delete itself -- could have used lowdb readonly
        if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }else if (user.password != password) {
        return done(null, false, { message: 'Incorrect password' });
      }else if(!user.isActive){
        return done(null, false, { message: 'Your Account is not active' });
      }
      else if(user && user.password == password && user.isActive){
        return done(null, user);
      }else{
        return done(null, false, { message: 'Unknown error please try again later' }); //if somehow we get to this point it really is an unknown error
      }
  }
));

console.log('Passport Loaded') //Give a cool console readout
module.exports = passport;
