const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users_controller');


// import {usersController, postsController} from '../controllers/users_controller';

router.get('/profile', usersController.profile);
router.get('/posts', usersController.posts);



module.exports = router;