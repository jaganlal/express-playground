var express = require('express');
var controller = require('../user/user.controller');
var router = express.Router();

router.post('/', controller.create);
module.exports = router;
