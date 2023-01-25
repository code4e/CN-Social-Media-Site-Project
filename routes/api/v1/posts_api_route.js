const express = require('express');

const router = express.Router();
const postsControllerAPI = require('../../../controllers/api/v1/posts_controller_api');
const passport = require('passport');



router.get('/', postsControllerAPI.index);


router.delete('/destroy', 
//checking that the user who is trying to delete the post is authenticated or not
passport.authenticate('jwt', { session: false }), 
postsControllerAPI.destroy);


module.exports = router;