const express = require('express');

const router = express.Router();
const commentsController = require('../controllers/comments_controller');

const passport = require('passport');

router.post('/create', passport.checkAuthentication, commentsController.create);
router.delete('/destroy', passport.checkAuthentication, commentsController.destroy);


module.exports = router;