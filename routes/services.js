var express = require('express');
var router = express.Router();

/* GET name page. */
router.get('/token', function(req, res, next) {
  res.cookie('token', new Date().getTime());
  res.end();
});

/* GET name page. */
router.get('/name', function(req, res, next) {
  setTimeout(function() {
    res.status(200).send({name: 'jaganlal'});
  }, 10);
});

module.exports = router;
