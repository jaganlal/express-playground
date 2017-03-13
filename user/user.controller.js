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
        console.log('User Profile: '+JSON.stringify(user.profile));
        
        var token = auth.createToken(user);
        return res.status(200).json({token});
      })
      .catch(validationError(res));
  },

  isexists: function(req, res, next) {
    return User.findOne({email: req.body.email.toLowerCase()})
              .exec()
              .then(user => {
                if(user) {
                  return res.status(409).send('User already exists');
                }

                next();
              })
              .catch(function(err) {console.log('isexists err: '+err.message)})
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
            return res.status(401).send('Incorrect Password');
          }

          console.log('User Profile: '+JSON.stringify(user.profile));

          var token = auth.createToken(user.profile);
          return res.status(200).json({token});
        });
      })
      .catch(function(err) {console.log('user login err: '+err.message)})
  },

  me: function(req, res) {
    console.log('User Profile from token: '+JSON.stringify(req.userprofile));

    return res.status(200).send(req.userprofile);
  }
}

module.exports = controller;
