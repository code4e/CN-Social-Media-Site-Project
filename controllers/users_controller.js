const User = require("../models/user");
const Friendship = require('../models/friendship');
const path = require('path');
const fs = require('fs');

module.exports.profile = async (req, res) => {
    //convert to async
    try {

        //show the profile of the requested user
        let user = await User.findById(req.params.userID);


        //handle pending friendship
        let pending_friendship = await Friendship.findOne({
            from_user: req.params.userID,
            to_user: req.user.id,
            is_pending: true
        });

        if (pending_friendship) {
            return res.render('user_profile', {
                title: 'Profile',
                profile_user: user,
                // user: loggedInUser,
                type: "pending"
            });
        }

        //handle sent friendship
        let sent_friendship = await Friendship.findOne({
            from_user: req.user.id,
            to_user: req.params.userID,
            is_pending: true
        });
        if (sent_friendship) {
            return res.render('user_profile', {
                title: 'Profile',
                profile_user: user,
                // user: loggedInUser,
                type: "sent"
            });
        }

        console.log('rest');

        //handle rest
        return res.render('user_profile', {
            title: 'Profile',
            profile_user: user,
            // user: loggedInUser,
            type: "all"
        });




    } catch (error) {
        console.log(`Error occured with ${error}`);
        return res.redirect('back');
    }

    //check if the req was of type pending or sent, then accordingly send the response

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

//toggle friend to either add or remove other user as a friend
module.exports.toggleFriend = async (req, res) => {

    // console.log(req.body);

    //check the toggle value, if the friend already exists, then remove it, otherwise add it
    if (req.body.toggleValue == "remove") {
        //remove friend
        //first, check if the frienship exists in the Friendship schema
        let friendship = null;

        //check friendship on both sides
        let f1 = await Friendship.findOne({ from_user: req.body.from_user, to_user: req.body.to_user });
        if (f1) friendship = f1;
        else friendship = await Friendship.findOne({ from_user: req.body.to_user, to_user: req.body.from_user });

        if (friendship) {
            //remove the friendships from the from_user and to_user
            //remove the friendship from user's friendship array
            let from_user = await User.findById(friendship.from_user);
            let to_user = await User.findById(friendship.to_user);

            if (from_user && to_user) {
                await User.findByIdAndUpdate(friendship.from_user,
                    { $pull: { friendships: friendship.id } });
                from_user.save();

                await User.findByIdAndUpdate(friendship.to_user,
                    { $pull: { friendships: friendship.id } });
                to_user.save();

                //remove the friendship
                friendship.remove();

                return res.status(200).json({
                    message: "Frienship removed",
                    data: {
                        request_status: "inactive"
                    }
                });
            }

        } else {
            return res.json({
                message: "friendship does not exist"
            })
        }
    } else if (req.body.toggleValue == "add") {
        // add friend
        //when the user adds the friend for the first time, we add it to the Frienship Schema with isPending as true
        try {
            let friendship = await Friendship.create({ ...req.body });

            //mark the friendship as pending in from_user
            let from_user = await User.findById(req.body.from_user);

            //mark the friendship as pending in to_user
            let to_user = await User.findById(req.body.to_user);

            //only add the friendships for the two users if they both exist
            if (from_user && to_user) {
                from_user.friendships.push(friendship);
                to_user.friendships.push(friendship);
                from_user.save();
                to_user.save();
            }

            console.log(`${from_user.name} has sent a friend request to ${to_user.name}`);

            return res.status(200).json({
                message: "Friend request sent",
                data: {
                    request_status: "active"
                }
            });
        } catch (error) {
            console.log('Cannot add friend');
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    } else {
        return res.status(500).json({
            message: "Oops something went wrong!"
        })
    }
}

//if there are any pending requests, and if the current user takes action on it (accepts or rejects the friend request), then this action fires
module.exports.updateRequestStatus = async (req, res) => {
    //check if the friend request was accepted or rejected then take action accordingly

    //accepted
    if (req.body.status == "accept") {

        try {
            let friendship = await Friendship.findOne({ ...req.body });
            if (friendship) {
                //set the is_pending of the friendship to be true
                let new_friendship = await Friendship.findByIdAndUpdate(friendship.id, {
                    is_pending: false
                }).populate('from_user');

                console.log(new_friendship);

                return res.status(200).json({
                    message: "requested accepted",
                    data: {
                        friend: new_friendship.from_user.name
                    }
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }
    //rejected. In case if requested is rejected, then remove it from the friendships and from user's friendship array as well
    else if (req.body.status == "reject") {
        try {
            let friendship = null;

            //check friendship on both sides
            let f1 = await Friendship.findOne({ from_user: req.body.from_user, to_user: req.body.to_user });
            if (f1) friendship = f1;
            else friendship = await Friendship.findOne({ from_user: req.body.to_user, to_user: req.body.from_user });

            if (friendship) {
                //remove the friendships from the from_user and to_user
                //remove the friendship from user's friendship array

                let from_user = await User.findById(friendship.from_user);
                let to_user = await User.findById(friendship.to_user);

                if (from_user && to_user) {
                    await User.findByIdAndUpdate(friendship.from_user,
                        { $pull: { friendships: friendship.id } });
                    from_user.save();

                    await User.findByIdAndUpdate(friendship.to_user,
                        { $pull: { friendships: friendship.id } });
                    to_user.save();

                    //remove the friendship
                    friendship.remove();

                    return res.status(200).json({
                        message: "requested rejected",
                        data: {
                            friend: from_user.name
                        }
                    });
                }


            } else {
                console.log('Error in rejecting the request');
                return res.status(500).json({
                    message: 'Error in rejecting the request'
                });
            }



        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }


    }
}
