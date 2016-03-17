var moment = require('moment');
var Patient = require('../models/Patient');
var Employee = require('../models/Employee');

/**
 * API to get all patients for certain business ID
 * @param req
 * @param res
 */
exports.getPatients = function(req,res) {
    //_id: req.query.id
    Patient.find({_admin_id: req.query.id}, function (err, patients) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        }
        else {
                if (patients) {
                    var appointments = [];
                    var current_appointment = moment().format("MMMM Do YYYY");
                    console.log(patients.length);
                    for (var i = 0; i < patients.length; i++) {
                        var patientName = patients[i].name;
                        var checkinTime = patients[i].checkinHour;
                        // appointments.push(patients[i].name, patients[i].checkinHour);
                        appointments.push({"name" : patientName, "Check-In Time" : checkinTime});
                    }
                    res.send(appointments);

                } // end of if (patients)
                else {
                    res.json({
                        type: false,
                        data: "bad"
                    })
                } // end of else (patients)
        }
    })
};

/**
 * Create new employee TODO - Currently not working
 * @param req
 * @param res
 */
exports.createEmployee = function(req, res) {
        Employee.find({email: req.query.email, _admin_id : req.query.id}, function (err, employee) {
            if (!employee) {
                var name = req.query.name;
                var number = req.query.number;
                var email = req.query.email;
                var password = "password";
                var subdomainurl = req.query.subdomainurl;
                var company_id = req.query.id;
                req.assert('email', 'Email is not valid').isEmail();
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

                        //emailEmployee(employee, req.user, password);
                    }
                });
            }
            if(err) {
                res.json({"message" : err});
            }
            else {
                res.json({"message" : "Found existing employee"});
            }
        })
    };



/**
 * Gets all employees for business ID
 * @param req
 * @param res
 */
exports.getEmployees = function(req,res) {
    //_id: req.query.id
    Employee.find({_admin_id: req.query.id}, function (err, employees) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        }
        else {
            if (employees) {
                var employeeList = [];
                console.log(employees.length);
                for (var i = 0; i < employees.length; i++) {
                    employeeList.push({"name" : employees[i].name, "email" : employees[i].email, "phone" : employees[i].phonenumber });
                }
                res.send(employeeList);

            }
            else {
                res.json({
                    type: false,
                    data: "bad"
                })
            }
        }
    })
};
