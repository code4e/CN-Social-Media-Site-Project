const express = require('express');

const router = express.Router();


router.use('/posts', require('./posts_api_route'));
router.use('/users', require('./users_api_route'));


module.exports = router;