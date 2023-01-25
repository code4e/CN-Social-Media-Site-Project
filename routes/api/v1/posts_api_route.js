const express = require('express');

const router = express.Router();
const postsControllerAPI = require('../../../controllers/api/v1/posts_controller_api');

router.get('/', postsControllerAPI.index);
router.delete('/destroy', postsControllerAPI.destroy);


module.exports = router;