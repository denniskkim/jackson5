var Employee = require('../models/Employee');
var Owner = require('../models/User');
var baby = require('babyparse');
var _ = require('lodash');
var async = require('async');
var nodemailer = require('nodemailer');
var passport = require('passport');
var fs = require('fs');
var validator = require('validator');
var Logger = require('le_node');
var logger = new Logger({
    token:'4ed0e98c-c21f-42f0-82ee-0031f09ca161'
});

/**
 + * GET /subdomain login
 + * Employees page.
 + */
exports.postSubdomain = function(req, res){
    Owner.findOne({subdomainurl: req.body.subdomain}, function(err, domain) {
        if (err) {
            // Send logs to logentries
            logger.log(4,"Find subDomain Error:" + domain);

            console.log("ERROR find subDomain: " + domain);
            res.redirect('/subdomain_login');
        }
        if(domain) {
            // Send logs to logentries
            logger.log(2,"Find subDomain Success:" + domain);

            console.log("success: " + domain);
            req.flash('success', { msg: 'Success! You are logged in.' });
            res.redirect('/login_employee');
        }
        else {
            res.render('subdomain_login', { msg: 'Cannot Find Your Company' });
        }
    });
};

/**
 * GET /add_employees
 * Employees page.
 */
exports.getEmployees = function(req, res){
    Employee.find({_admin_id: req.user.id/*, name: "Jane Doe"*/}, function (err, employees) {
        //console.log(employee);
        // Send logs to logentries
        logger.log(2,"Find Employee Success:" + employees);

        res.render('add_employees',{title: 'Add Employees', employees: employees, layout: 'navigation_admin'});
    });
};

/**
 * POST /add_employees
 * Add an employee using form.
 */
exports.addEmployee = function(req, res) {
    var name = req.body.name;
    var number = req.body.number;
    var email = req.body.email;
    var password = generateRandomString();
    var company_id = req.user.id;

    var subdomainurl = req.user.subdomainurl;
    req.assert('email', 'Email is not valid').isEmail();
    //req.assert('number', 'Phone number is invalid').isMobilePhone('en-US'); // not a good validator

    Employee.create({
        name: name,
        phone_number: number,
        email: email,
        password: password,
        subdomainurl: subdomainurl,
        _admin_id: company_id
    }, function (err, employee) {
        if (err) {
            // Send logs to logentries
            logger.log(4,"Create employee failed: "+err);

            console.log("ERROR creating employee: ");
            console.log(err);

            //TODO - display error message
            res.redirect('add_employees');

            //res.send("There was a problem adding the employee to the databaase");
        } else {
            // Send logs to logentries
            logger.log(2,"Create employee Success: "+err);

            //console.log('Creating new employee: ' + employee);
            res.redirect('add_employees');

            emailEmployee(employee, req.user, password);
        }
    });
};

exports.addEmployeesThroughCSV = function(req, res) {
    var content = fs.readFileSync(req.file.path, { encoding: 'binary' });
    var parsed = baby.parse(content);
    var rows = parsed.data;
    var admin_id = req.user.id;

    for(var i = 0; i < rows.length; i++){
        var name = rows[i][0].trim();
        var phone = rows[i][1].trim();
        var email = rows[i][2].trim();

        if (!validator.isEmail(email)) {
            console.log("Employee #" + i + " " + name + " does not have a valid email: " + email + ".")
        } else {
            (function(password) { //anonymous function to enforce password is not outside closure
                Employee.create({
                        name: name,
                        phone_number: phone,
                        email: email,
                        password: password,
                        _admin_id: admin_id
                    }, function (err, employee) {
                        if (err) {
                            console.log("ERROR creating employee");
                            console.log(err);
                            //res.send("There was a problem adding the employee to the database");
                        } else {
                            //emailEmployee(employee, req.user, password);
                        }
                    }
                );
            })(generateRandomString());
        }
    }
    res.redirect('/add_employees');
};

exports.selectEmployee = function(req, res) {
    Employee.findById(req.id, function(err, employee) {
        if (err) {
            console.log("ERROR selecting employee: " + employee);
            //res.send("There was an error selecting the employee");
        } else {
            res.render('editEmployee', {title: "Employee: " + employee.name, employee: employee});
        }
    })
};

exports.editEmployee = function(req, res) {
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;

    Employee.findById(req.id, function(err, employee) {
        if (err) {
            console.log("ERROR selecting employee: " + employee);
            //res.send("There was an error selecting the employee");
        } else {
            employee.update({
                name: name,
                phone_number: phone,
                email: email
            }, function(err, employee) {
                if (err) {
                    console.log("ERROR updating employee: " + employee);
                    //res.send("There was an error updating the employee");
                } else {
                    res.redirect("/add_employees");
                }
            })
        }
    })
};

exports.emailEmployee = function(req, res) {
            var options = {
                service: 'gmail',
                auth: {
                user: 'donotreply.receptional@gmail.com',
                pass: 'nightowls1'
                }
            };
            var emailtext = req.body.message;
            var transporter = nodemailer.createTransport(options);
            // Setup email data
            var mailOptions = {
                from: req.user.email,
                to: req.body.to,
                subject: "Receptional",
                text: emailtext,
                html: emailtext
            };
            // Send email
            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    console.log("Fail sending" + error);
                }
                else {
                    console.log('Message sent: ' + info);
                    console.log(emailtext);
                }
            });

            res.redirect("/add_employees");
};



exports.removeEmployee = function(req, res) {
    Employee.findById(req.params.id, function(err, employee) {
        if (err) {
            console.log("ERROR selecting employee: " + employee);
            //res.send("There was an error selecting the employee");
        } else {
            employee.remove(function (err, employee) {
                if (err) {
                    console.log("ERROR removing employee: " + employee);
                    //res.send("There was an error removing the employee");
                } else {
                    console.log("Successfully removed " + employee.name);
                    res.redirect("/add_employees");
                }
            })
        }
    })
};

/**
 * GET /login
 * Login page.
 */
exports.getEmployeeLogin = function(req, res) {


    if (req.user) {
        return res.redirect('/');
    }

    var domain = req.headers.host,
        subDomain = domain.split('.');

    if(subDomain.length > 1) {
        subDomain = subDomain[0].split("-").join(" ");
    }
    res.render('login_employee', {
        subdomain: subDomain
    });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postEmployeeLogin = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        req.flash('errors', errors);
        logger.log(4,"User login Failed:" + errors);
        return res.redirect('/login_employee');
    }

    passport.authenticate('employee', function(err, employee, info) {
        console.log(info);
        if (err) {
            logger.log(4,"User login Failed:" + err);

            return next(err);
        }
        if (!employee) {
            console.log(err);
            req.flash('errors', { msg: info.message });
            logger.log(4,"User login Failed:" + err);

            return res.redirect('/login');
        }
        req.logIn(employee, function(err) {
            if (err) {
                return next(err);
                logger.log(4,"User login Failed:" + err);

            }

            employee.lastLoginDate = Date.now();
            employee.save();
            logger.log(2,"User login Success:");

            req.flash('success', { msg: 'Success! You are logged in.' });
            //res.redirect(req.session.returnTo || '/dashboard_admin');
            res.redirect('/dashboard_employee');
        });
    })(req, res, next);
};

function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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

  Employee.findById(req.user.id, function(err, user) {
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
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  console.log("update profile");
  Employee.findById(req.user.id, function(err, user) {
      console.log(req.user.id);
    if (err) {
      // Send logs to logentries
      console.log("Edit profile failed: " + err);

      return next(err);
    }
    user.email = req.body.email || '';
    user.name = req.body.name || '';
    user.phone_number = req.body.phone || '';
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