const express = require('express');

const router = express.Router();
const postsControllerAPI = require('../../../controllers/api/v2/posts_controller_api');

router.get('/', postsControllerAPI.index);


module.exports = router;