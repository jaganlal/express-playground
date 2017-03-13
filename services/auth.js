var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var secret = "SSSHHH!!!!DONT-TELL-TOP-SECRET";

module.exports = {
  authorize: function(req, res, next) {
    var token = req.query.access_token || req.headers.authorization || req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
    console.log(token);
    if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          console.error(err);
          return res.status(403).send('error authorizing token');
        } else {
          req.userprofile = decoded;
          return next();
        }
      });
    } else {
      console.error('not authorized');
      return res.sendStatus(403);
    }
  }, 

  createToken: function(user) {
    return jwt.sign(user, secret, {
      expiresIn: 24 * 60 * 60
    });
  }
}