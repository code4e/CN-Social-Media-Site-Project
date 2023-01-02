const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


//authentication using passport by telling passport to use local strategy for authentication
passport.use(new LocalStrategy(
    {
        // usernameFiled in the schema that we are using to authenticate is email, so we provide the value as email
        usernameField: "email"
    },
    function (email, password, done) {

        //find the user in the db and establish the identity
        User.findOne({ email: email }, function (err, user) {
            //handle err
            if (err) {
                console.log('Error in finding user --> passport');
                return done(err);
            }

            // handle user not found or passport don't match
            if (!user || user.password !== password) {
                console.log('Invalid username/password');
                return done(null, false);
            }

            //everything good, so send the user fetched from db to the done() to pass it onto the next middleware
            return done(null, user);
        });
    }
));

// serialize user, i.e. put the user.id into the cookies and not the rest of the info for encryption. Decide which key to be kept in the cookies
passport.seriapassport.serializeUser(function (user, done) {
    //automatically encypts the user.id into the cookies
    return done(null, user.id);
});

// deserialize user, i.e., when cookies are being sent to the server from the browser, we are taking out the id from the cookies and finding it in the db
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log('Error in finding user --> passport');
            return done(err);
        }
        return done(err, user);
    });
});

module.exports = passport;

