const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users_controller');
const passport = require('passport');

// import {usersController, postsController} from '../controllers/users_controller';

router.get('/', (req, res) => res.render('user_profile', { title: "Users" }));


router.get('/profile/:userID',
    //middleware to only take the user to the profile page only when the user is signed in
    passport.checkAuthentication
    , usersController.profile);


router.get('/posts', usersController.posts);

//sign in page
router.get('/sign-in',
    //checking if user is already signed in, make the sign in page inaccessible to them
    passport.checkAlreadyLoggedIn,
    usersController.signIn);

//sign up page
router.get('/sign-up',
    //checking if user is already signed in, make the sign up page inaccessible to them
    passport.checkAlreadyLoggedIn,
    usersController.signUp);

router.post('/create', usersController.create);

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    //if the authentication is sucessfull, done() returns the user
    'local',
    { failureRedirect: '/users/sign-in' }
), usersController.createSession);


//router to update the details of the user
router.post('/update/:userID', passport.checkAuthentication, usersController.update);

router.get('/sign-out', usersController.destroySession);




//google oauth2 authentication routes

//first make the request to google auth for signing in/ up the user
router.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

//after the user has been signed in, receieve back the request from the callback url sent by google with user info and handle success and failure accordingly
router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure'
    }), usersController.createSession);


//when user decides to add or remove friend, then request to this route is fired
router.patch('/toggle-friend', passport.checkAuthentication, usersController.toggleFriend);

//update the status of any pending request
router.patch('/update-friend-status', passport.checkAuthentication, usersController.updateRequestStatus);




module.exports = router;