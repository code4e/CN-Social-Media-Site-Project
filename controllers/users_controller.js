const User = require("../models/user");

module.exports.profile = (req, res) => {
    console.log('Profile ');
    // return res.send('<h1>Profile from express called</h1>');
    return res.render('user_profile', {
        title: 'Profile'
    });
}


module.exports.posts = (req, res) => {
    console.log('Posts');
    // return res.send('<h1>Posts from express called</h1>');
    return res.render('user_profile', {
        title: 'Posts'
    });
}


// render the sign in page
module.exports.signIn = (req, res) => {
    console.log('User sign in');

    return res.render('user_sign_in', {
        title: 'Codial | Sign In'
    });
}


// render the sign up page
module.exports.signUp = (req, res) => {
    console.log('User sign up');

    return res.render('user_sign_up', {
        title: 'Codial | Sign Up'
    });
}

//sign up user by getting the sign up data
module.exports.create = (req, res) => {
    // console.log('user sign up');
    // return res.send('User has signed up');

    //check password and confirm pa ssword
    if (req.body.password === req.body.confirm_password) {

        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
                console.log('Error in fetching user from db');
                return res.redirect('back');
            }
            if (!user) {

                User.create(req.body, function (err, data) {
                    if (err) {
                        console.log('error in creating user while signing up')
                        return res.redirect('back');
                    } else {
                        console.log(data);
                        return res.redirect('/users/sign-in');
                    }
                });
            }
            if (user) {
                console.log('User already exists in the db');
                res.redirect('back');
            }
        });




    } else {
        return res.redirect('back');
    }

}


// fetch the data of signed in user, i.e. create a new session for the user
module.exports.createSession = (req, res) => {
    // console.log(req.cookies);
    return res.redirect('/');
}


//sign out the user
module.exports.destroySession = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}