const express = require('express');

const router = express.Router();


router.use('/posts', require('./posts_api_route'));






module.exports = router;