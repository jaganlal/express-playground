var auth = require('../services/auth');
var User = require('./user.model');
var express = require('express');
var router = express.Router();

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    console.log('ValidationError: '+err.message);
    return res.status(statusCode).json(err);
  };
}

var controller = {
  create: function(req, res) {
    console.log('Request object is '+JSON.stringify(req.body));
    var newUser = User(req.body);
    return newUser.save()
      .then(function(user) {
        console.log('User created successfully '+JSON.stringify(user));
        console.log('User Profile: '+JSON.stringify(user.profile));
        
        var token = auth.createToken(user);
        return res.status(200).json({token});
      })
      .catch(validationError(res));
  },

  login: function(req, res, next) {
    User.findOne({email: req.body.email.toLowerCase()})
      .exec()
      .then(user => {
        if(!user) {
          res.status(404).send('This email is not registered.');
        }

        user.comparePassword(req.body.password, function(err, correctPassword) {
          if(err || !correctPassword) {
            console.log('Incorrect Password');
            res.status(401).send('Incorrect Password');
          }

          var token = auth.createToken(req.body);
          return res.status(200).json({token});
        });
      })
      .catch(function(err) {console.log('user login err: '+err.message)})
  }
}

module.exports = controller;
