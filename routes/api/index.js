const express = require('express');

const router = express.Router();


//redirect all api requests for v1 to v1 folder
router.use('/v1', require('./v1/index'));

//redirect all api requests for v2 to v2 folder
router.use('/v2', require('./v2/index'));








module.exports = router;