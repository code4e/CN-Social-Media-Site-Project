const User = require("../models/user");

module.exports.profile = async (req, res) => {
    //convert to async
    try {
        //show the profile of the requested user
        let user = await User.findById(req.params.userID);
        return res.render('user_profile', {
            title: 'Profile',
            profile_user: user
        });

    } catch (error) {
        console.log(`Error occured with ${error}`);
        return res.redirect('back');
    }


    //callback code
    // //show the profile of the requested user
    // User.findById(req.params.userID, function (err, user) {
    //     if (err) {
    //         console.log('error in fetching user from db');
    //         return res.redirect('back');
    //     }

    //     return res.render('user_profile', {
    //         title: 'Profile',
    //         profile_user: user
    //     });
    // });

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
module.exports.create = async (req, res) => {

    //check password and confirm pa ssword
    if (req.body.password === req.body.confirm_password) {
        //convert to async code
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                //only create the user, if it does not already exists in db
                let user = await User.create({ ...req.body });
                console.log(`User ${user} created and signed up sucessfully in the db`);
                return res.redirect('/users/sign-in');
            } else {
                console.log(`User already exists in the db under ${user}`);
                res.redirect('back');
            }

        } catch (error) {
            console.log(`Error occured with ${error}`);
            return res.redirect('back');
        }
        //callback code
        // User.findOne({ email: req.body.email }, function (err, user) {
        //     if (err) {
        //         console.log('Error in fetching user from db');
        //         return res.redirect('back');
        //     }
        //     if (!user) {
        //         //only create the user, if it does not already exists in db
        //         User.create(req.body, function (err, data) {
        //             if (err) {
        //                 console.log('error in creating user while signing up')
        //                 return res.redirect('back');
        //             } else {
        //                 console.log(data);
        //                 return res.redirect('/users/sign-in');
        //             }
        //         });
        //     }
        //     if (user) {
        //         console.log('User already exists in the db');
        //         res.redirect('back');
        //     }
        // });

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

//update the details of the user
module.exports.update = async (req, res) => {



    //place a check to see if the current logged in user is the one who has requested an update in profile details. Only if that's the case, update it
    if (req.user.id == req.params.userID) {
        //convert to async code
        try {
            let user = await User.findByIdAndUpdate(req.params.userID, { ...req.body });
            console.log(`User - ${user} has bee updated sucessfully in the db`);
            return res.redirect('back');

        } catch (error) {
            console.log(`Error occured with ${error}`);
            return res.redirect('back');
        }
        //callback code
        // User.findByIdAndUpdate(req.params.userID, {
        //     ...req.body
        // }, function (err, user) {
        //     if (err) {
        //         console.log('Error in updating the user in the db');
        //         return res.redirect('back');
        //     }
        //     console.log(user);
        //     return res.redirect('/');
        // });
    }
    //if the user is trying to update the details of some other user, by fiddling with the params at the front end and putting the some other user's userID in the params
    // send an unauthorized status to prevent this.
    return res.status(401).send('Unauthorized');


}