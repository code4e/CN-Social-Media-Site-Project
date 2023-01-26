const passport = require('passport');
const GoogleOAuth2Strategy = require('passport-google-oauth2').Strategy;
const User = require('../models/user');
const crypto = require('crypto');

//tell passport to use the google outh2 for sign in / sign up
passport.use(new GoogleOAuth2Strategy({
    clientID: '1025038679354-30n6tq00nb8muhgft32v1df5b36svg72.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/users/auth/google/callback',
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {

        //after confirmation of sign in from google, finding if the user exists or not in our database
        let user = User.findOne({ email: profile.emails[0].value }).exec(function(err, user){
            if(err){console.log('error in google oauth2 strategy'); return;}

            //if user exists, then sign in and set user as req.user
            if(user){
                return done(null, user);
            }
            //user does not exist in our db yet, so we sign him up i.e. create the user in db and set him as req.user
            else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){ console.log('error in creating in the user in db google oauth2 strategy'); return;}

                    return done(null, user);
                });
            }
        });

    }
));



module.exports = passport;
