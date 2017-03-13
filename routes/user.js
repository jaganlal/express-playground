var express = require('express');
var controller = require('../user/user.controller');
var auth = require('../services/auth');

var router = express.Router();

router.post('/', controller.isexists, controller.create);
router.get('/me', auth.authorize, controller.me);
module.exports = router;
