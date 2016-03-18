var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var employeeSchema = new mongoose.Schema({
    name: String,
    phone_number: String, /* or Number */
    email: { type: String, unique: true, lowercase: true },
    password: String,
    lastLoginDate: Date,
    subdomainurl: String,
    picture: String,
    _admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
});

/**
 * Password hash middleware.
 */
 employeeSchema.pre('save', function(next) {
    var employee = this;
    if (!employee.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(employee.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            employee.password = hash;
            next();
        });
    });
});

/**
 * Helper method for validating user's password.
 */
 employeeSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('Employee', employeeSchema);