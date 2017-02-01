var auth = require('../services/auth');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log(JSON.stringify(req.body.username));
  var token = auth.createToken(req.body.username);
  res.json({ token: token });
});

module.exports = router;

