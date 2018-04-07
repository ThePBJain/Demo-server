var passport = require('passport');
var LocalStrategy = require('passport-local');
//var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
//const BasicStrategy = require('passport-http').BasicStrategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/user');


passport.use('user-local', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
        //return done(null, false);
    })
);
passport.use('user-mobile', new JwtStrategy({
        // Telling Passport to check authorization headers for JWT
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        // Telling Passport where to find the secret
        secretOrKey: process.env.SECRET
    },
    function(payload, done) {
        //console.log("Testing User-Mobile auth flow:  \nPayload: " + JSON.stringify(payload));
        //todo: this wont work since we've commented this out.
        /*User.findOne({ email: payload.email }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }else{

                return done(null, user);
            }
        });*/
        return done(err);
    }
));



//fix these to work with both models
passport.serializeUser(function(user, done) {

    done(null, user.id);
});

passport.deserializeUser(function(key, done) {
    User.findById(key.id, function(err, user) {
        if (!err) {
            done(null, user);
        } else {
            done(err, null);
        }
    });
    //done(err, null);

});

module.exports = passport;