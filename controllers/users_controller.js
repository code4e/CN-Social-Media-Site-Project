const User = require("../models/user");
const path = require('path');
const fs = require('fs');

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

                req.flash('success', `Sign Up successful! Please login to continue`);
                return res.redirect('/users/sign-in');
            } else {
                console.log(`User already exists in the db under ${user}`);
                req.flash('warning', `User ${user.email} already exists! Try again`);
                res.redirect('back');
            }

        } catch (error) {
            console.log(`Error occured with ${error}`);
            req.flash('error', 'Oops! Something went wrong! Try again');
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
    //set the flash message for successful session creation i.e. siging in
    req.flash('success', `Logged in Successully! Welcome ${req.user.name}`);
    return res.redirect('/');
}


//sign out the user
module.exports.destroySession = (req, res) => {
    //set the flash message for successful session destruction i.e. signing out
    console.log('Signed out');

    req.logout(function (err) {

        if (err) { return next(err); }

        req.flash('success', 'You have logged out successfully!');
        res.redirect('/');
    });
}

//update the details of the user
module.exports.update = async (req, res) => {



    //place a check to see if the current logged in user is the one who has requested an update in profile details. Only if that's the case, update it
    if (req.user.id == req.params.userID) {
        //convert to async code
        try {
            let user = await User.findById(req.params.userID);
            //since we've made the update user form in the views as multipart, we cannot directly parse in req.body. For this, we'll use multer
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log('********multer error********', err);
                }

                //update the user
                user.name = req.body.name;
                user.email = req.body.email;

                //if user is uploading a file, then only we are saving it in the storage
                if (req.file) {
                    //check if the file path is already there and that file is also there. If yes, then remove the previous avatar image and save the new one
                    if (user.avatar && checkFileExistsSync(path.join(__dirname, '..', user.avatar))) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    //saving the path in the db where file is stored in the storage
                    user.avatar = `${User.avatarPath}/${req.file.filename}`;
                }

                user.save();

                console.log(`User - ${user} has bee updated successfully in the db`);
                req.flash('success', `User ${user.name} updated successfully`);
                return res.redirect('back');

            });


        } catch (error) {
            console.log(`Error occured with ${error}`);
            req.flash('error', 'Oops! Something went wrong! Please try again');
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
    else {
        req.flash('warning', 'Sorry! You are not authorized');
        return res.status(401).send('Unauthorized');
    }

}

function checkFileExistsSync(filepath) {
    let flag = true;
    try {
        fs.accessSync(filepath, fs.constants.F_OK);
    } catch (e) {
        flag = false;
    }
    return flag;
}
