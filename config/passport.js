var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

module.exports = function(passport) {
  // Serialize and deserialize object
  passport.serializeUser(function(user,done){
    console.log(user);
    done(null,user.id);
  })

  passport.deserializeUser(function(id,done){
    User.find({where: {id:id}}).then(function(user){
      done(null,user);
    }).error(function(err){
      done(err,null);
    })
  })

  // Passport configuration
  passport.use('local-login',new LocalStrategy(
    function(username, password, done) {
      console.log(username);
      console.log(password);
      User.findOne({
        where: {
          'username': username
        }
      }).then(function (user) {
        console.log(user);
        if (user == null) {
          return done(null, false, { message: 'Incorrect credentials.' })
        }

       var hashedPassword = bcrypt.hashSync(password, user.salt)
        if (user.password === password) {
          return done(null, user)
        }

        return done(null, false, { message: 'Incorrect credentials.' })
      })
    }
  ))
}
