var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

var Logger = require('le_node');
var logger = new Logger({
  token:'4ed0e98c-c21f-42f0-82ee-0031f09ca161'
});

var analytics = require('../controllers/analytics');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {

  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    // Send logs to logentries
    logger.log(4,"User login Failed:" + errors);

    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('business_owner', function(err, user, info) {
    if (err) {
      // Send logs to logentries
      logger.log(4,"User login Failed:" + err);

      return next(err);
    }
    if (!user) {

      // Send logs to logentries
      logger.log(4,"User login Failed: user was null");

      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        // Send logs to logentries
        logger.log(4,"User login Failed:" + errors);
        return next(err);
      }

      user.lastLoginDate = Date.now();
      user.save();

      // Send logs to logentries
      logger.log(2,"User login Success:");
      req.flash('success', { msg: 'Success! You are logged in.' });
      //res.redirect(req.session.returnTo || '/dashboard_admin');
      if(user.email === "petervenkmen@ghostbusters.com"){
        logger.log(1,"Peter login Success:");

        res.redirect('/dashboard_peter');
      }
      res.redirect('/dashboard_admin');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password,
    companyname: req.body.companyname,
    phonenumber: req.body.companyphone,
    subdomainurl: req.body.subdomainurl,
    signupdate: Date.now(),
    name: req.body.name
  });



  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {

      // Send logs to logentries
      logger.log(4,"New user create Business owner account failed" + "Account with that email address already exists");

      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save(function(err) {
      if (err) {
        // Send logs to logentries
        logger.log(4,"New user create Business owner account failed" + err);

        return next(err);
      }
      req.logIn(user, function(err) {
        if (err) {
          // Send logs to logentries
          logger.log(4,"New user create Business owner account failed" + err);

          return next(err);
        }

        analytics.updateBusinessCount();

        // Send logs to logentries
        logger.log(2,"New user successfully created Business owner account");
        res.redirect('/');
      });
    });
  });
};

//exports.viewBusiness = function(req,res,next){
//  User.findOne({email : req.query.email
//  } , function(err, users) {
//      if(err) {
//        res.status(500);
//        res.json({
//          type: false,
//          data: "Error occured: " + err
//        })
//      } else {
//        console.log(users)
//        if(users) {
//          console.log(users);
//          res.json(users)
//        } else {
//          res.json({
//            type: false,
//            data: "Bad"
//          })
//        }
//      }
//  })
//};

///**
// * API Call - Returns all business names
// * /viewbusinesses
// */
//exports.viewBusinesses = function(req,res,next){
//  User.find({} , function(err, users) {
//    if(err) {
//      res.status(500);
//      res.json({
//        type: false,
//        data: "Error occured: " + err
//      })
//    } else {
//      if(users) {
//        var business = [];
//        for(var i = 0; i < users.length; i++ ){
//          business.push(users[i].companyname);
//        }
//        res.json(business);
//      } else {
//        res.json({
//          type: false,
//          data: "Bad"
//        })
//      }
//    }
//  })
//};




//TODO
//exports.viewEmployees = function(req, res) {
//  Users.find({userId : req.id}, function(err, users) {
//    if(err) {
//      res.status(500);
//      res.json({
//        type: false,
//        data: "Error occured: " + err
//      })
//    } else {
//      if(users) {
//        var employees = [];
//      }
//    }
//  })
//}

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};


/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  console.log("update profile");
  User.findById(req.user.id, function(err, user) {
      console.log(req.user.id);
    if (err) {
      // Send logs to logentries
      console.log("Edit profile failed: " + err);

      return next(err);
    }
    user.email = req.body.email || '';
    user.companyname = req.body.name || '';
    user.phonenumber = req.body.phone || '';
    user.picture = req.body.photo || '';
    user.save(function(err) {
      if (err) {
        // Send logs to logentries
        console.log("Edit profile failed: " + err);
        return next(err);
      }
      // Send logs to logentries
      console.log("Edit profile Success");

      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/settings');
    });
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateForm = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      // Send logs to logentries
      logger.log(4,"Update Profile failed: " + err);

      console.log(err);
      return next(err);
    }
    user.form = req.body.form || '';
    user.save(function(err) {
      if (err) {
        // Send logs to logentries
        logger.log(4,"Update Profile failed: " + err);
        console.log(err);
        return next(err);
      }
      // Send logs to logentries
      logger.log(2,"Update Profile Success");

      req.flash('success', { msg: 'Form information updated.' });
      res.redirect('/form');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
  // req.assert('password', 'Password must be at least 4 characters long').len(4);
  // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  // console.log("get in update password ");
  // var errors = req.validationErrors();

  // if (errors) {
  //   console.log("update password failed: " + errors);
  //   req.flash('errors', errors);
  //   return res.redirect('/settings');
  // }

  User.findById(req.user.id, function(err, user) {
    if (err) {
      console.log(" failed: " + err);
      return next(err);
    }
    user.password = req.body.password;
    user.save(function(err) {
      if (err) {
        console.log(" failed: " + err);
        return next(err);
      }
      console.log("success ");
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/settings');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    if (err) {
      // Send logs to logentries
      logger.log(4,"Delete account failed: "+err);

      return next(err);
    }

    // Send logs to logentries
    logger.log(2,"Delete account Success");

    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });
    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save(function(err) {
            if (err) {
              return next(err);
            }
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Your Hackathon Starter password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that email address exists.' });
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Reset your password on Hackathon Starter',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/forgot');
  });
};

asdlfghkladgshakljdsfgha sdlkjghlkagfdh -2- 280938 

function emailEmployee(employee, admin, password) {
    // Create SMTP transporter object
    var options = {
        service: 'gmail',
        auth: {
            user: 'donotreply.receptional@gmail.com',
            pass: 'nightowls1'
        }
    };
    var companyname = admin.companyname;
    var subdomainurl = admin.subdomainurl;
    var emailtext = "Hello " + employee.name + "! Welcome to receptional. You have been added to the company: " + companyname + ". You can access your company receptional website at: " + subdomainurl + ".receptional.xyz. You're password is " + password + ".";
    var transporter = nodemailer.createTransport(options);
    // Setup email data
    var mailOptions = {
        from: '"Receptional.xyz" <donotreply.receptional@gmail.com>',
        to: employee.email,
        subject: "Welcome to Receptional",
        text: emailtext,
        html: emailtext
    };
    // Send email
    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.log(error);
        }
        else {
            console.log('Message sent: ' + info.response);
            console.log(emailtext);
        }
    });
}
