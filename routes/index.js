const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');
const passport = require('passport');

router.use('/users', require('./users'));

//only allow authenticated users to post 
router.use('/posts', require('./posts'));

router.get('/', homeController.home);
router.get('/home', homeController.home);






module.exports = router;