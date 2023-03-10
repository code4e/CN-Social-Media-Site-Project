const express = require('express');

const router = express.Router();
const postsController = require('../controllers/posts_controller');

const passport = require('passport');

router.post('/create', passport.checkAuthentication, postsController.create);

//route to delete post and associated comments
router.delete('/destroy/:id', passport.checkAuthentication, postsController.destroy);


module.exports = router;