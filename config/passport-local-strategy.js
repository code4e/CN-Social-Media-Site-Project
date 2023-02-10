const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


//authentication using passport by telling passport to use local strategy for authentication
passport.use(new LocalStrategy(
    {
        // usernameFiled in the schema that we are using to authenticate is email, so we provide the value as email
        usernameField: "email",

        //for making req object accessible in the below callback as the first argument
        passReqToCallback: true
    },
    async function (req, email, password, done) {



        try {
            //find the user in the db and establish the identity
            let user = await User.findOne({ email: email });

            // handle user not found or passport don't match
            if (!user || user.password !== password) {
                console.log('Invalid username/password');
                req.flash('error', 'Invalid username/password! Please try again');
                return done(null, false);
            }
            //everything good, so send the user fetched from db to the done() to pass it onto the next middleware i.e serialize the user as a next step
            return done(null, user);

        } catch (error) {
            //handle err
            console.log('Error in finding user --> passport');
            req.flash('error', 'Error in finding the user');
            return done(error);
        }



        // User.findOne({ email: email }, function (err, user) {
        //     //handle err
        //     if (err) {
        //         console.log('Error in finding user --> passport');
        //         req.flash('error', 'Error in finding the user');
        //         return done(err);
        //     }

        //     // handle user not found or passport don't match
        //     if (!user || user.password !== password) {
        //         console.log('Invalid username/password');
        //         req.flash('error', 'Invalid username/password! Please try again');
        //         return done(null, false);
        //     }

        //     //everything good, so send the user fetched from db to the done() to pass it onto the next middleware i.e serialize the user as a next step
        //     return done(null, user);
        // });
    }
));

// serialize user, i.e. put the user.id into the cookies and not the rest of the info for encryption. Decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
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


//check if user is authenticated, using this fn as a middleware
passport.checkAuthentication = (req, res, next) => {
    //passport attaches a method when authentication happens, i.e. if the user is signed in, pass on the req to the next fn i.e. users_controller action(s)
    if (req.isAuthenticated()) {
        return next();
    }
    //if user is not signed in
    return res.redirect('/users/sign-in');
}

//setting the user from the req to res locals
passport.setAuthenticatedUser = async (req, res, next) => {
    if (req.isAuthenticated()) {
        //req.user contains the current signed in user from session cookie, we're just sending it to the locals for the views by attaching the user to the res.locals
        // res.locals.user = req.user;
        let user = await User.findById(req.user.id).populate('friendships');
        res.locals.user = user;

    }
    return next();

}

//middleware to redirect user to the profile page if they are already logged in but are trying to access sign-in/sign-up pages, which should be inaccessible at this stage
passport.checkAlreadyLoggedIn = (req, res, next) => !req.isAuthenticated() ? next() : res.redirect(`/users/profile/${req.user.id}`);


module.exports = passport;

