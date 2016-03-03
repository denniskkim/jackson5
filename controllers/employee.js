var Employee = require('../models/Employee');
var Owner = require('../models/User');
var baby = require('babyparse');
var _ = require('lodash');
var async = require('async');
var nodemailer = require('nodemailer');
var passport = require('passport');
var fs = require('fs');

/**
 + * GET /subdomain login
 + * Employees page.
 + */
exports.postSubdomain = function(req, res){
    Owner.findOne({subdomainurl: req.body.subdomain}, function(err, domain) {
        if (err) {
            console.log("ERROR find subDomain: " + domain);
            res.redirect('/subdomain_login');
        }
        if(domain) {
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
            console.log("ERROR creating employee: ");
            console.log(err);

            //TODO - display error message
            res.redirect('add_employees');

            //res.send("There was a problem adding the employee to the databaase");
        } else {
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
        var name = rows[i][0];
        var phone = rows[i][1];
        var email = rows[i][2];
        var password = generateRandomString();

        if (!isEmail(email, 'Email is not valid')) {
            console.log("Employee #" + i + " " + name + " does not have a valid email")
        }

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
                console.log(employee);
                //emailEmployee(employee, req.user, password);
            }}
        );
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
        return res.redirect('/login_employee');
    }

    passport.authenticate('employee', function(err, employee, info) {
        console.log(info);
        if (err) {
            return next(err);
        }
        if (!employee) {
            console.log(err);
            req.flash('errors', { msg: info.message });
            return res.redirect('/login');
        }
        req.logIn(employee, function(err) {
            if (err) {
                return next(err);
            }
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
        to: /*employee.email **Hard coded for now */ 'donotreply.receptional@gmail.com',
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