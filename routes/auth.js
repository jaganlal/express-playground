var auth = require('../services/auth');
var express = require('express');
var user = require('../user/user.controller');
var router = express.Router();

router.post('/', user.login);

// router.post('/', function(req, res, next) {
//   console.log(JSON.stringify(req.body.username));
//   var token = auth.createToken(req.body.username);

//   //validate user from DB
//   res.json({ token: token });
// });

module.exports = router;

