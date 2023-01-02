const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users_controller');
const passport = require('passport');

// import {usersController, postsController} from '../controllers/users_controller';

router.get('/', (req, res) => res.render('user_profile', {title: "Users"}));


router.get('/profile', 
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
    {failureRedirect: '/users/sign-in'}
),usersController.createSession);

router.get('/sign-out', usersController.destroySession);




module.exports = router;