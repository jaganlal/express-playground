var express = require('express');
var router = express.Router();

/* GET name page. */
router.get('/token', function(req, res, next) {
  res.cookie('newtoken', 'simple-test-token');
  res.send({name: 'jaganlal'});
  // res.end();
  // res.cookie('token' , 'cookie_value').send({name: 'jaganlal'});
});

/* GET name page. */
router.get('/name', function(req, res, next) {
  res.send({name: 'jaganlal'});
});

module.exports = router;
