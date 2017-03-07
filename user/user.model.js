var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String, 
    unique: true, 
    lowercase: true, 
    required: true
  }, 
  password: {
    type: String, 
    required: true
  }, 
  role: {
    type: String, 
    default: 'user'
  }
});

/**
 * Virtuals
 */
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      email: this.email, 
      role: this.role
    }
  });

/**
 * Validations
 */
UserSchema
  .path('email')
  .validate(function(email) {
    var emailRegEx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return emailRegEx.test(email);
  }, 'Invalid email id');

  UserSchema
  .path('password')
  .validate(function(password) {
    return password.length;
  }, 'Password cannot be blank');



/**
 * Hooks
 */
UserSchema
  .pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) {
      return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);

        user.password = hash;
        next();
      });
    });
  });

/**
 * Methods
 */
UserSchema.methods = {
  comparePassword(newpassword, callback) {
    bcrypt.compare(newpassword, this.password, (err, isMatch) => {
      if(err) return callback(err);
      return callback(null, isMatch);
    });
  }
}


module.exports = mongoose.model('User', UserSchema);
