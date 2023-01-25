const express = require('express');
const User = require('../../../models/user');
const router = express.Router();
const passport = require('passport');
const usersControllerAPI = require('../../../controllers/api/v1/users_controller_api');




router.post('/create-session', usersControllerAPI.createSession);





module.exports = router;