var moment = require('moment');
var Patient = require('../models/Patient');
var Employee = require('../models/Employee');
var User = require('../models/User');


/**
 * TODO - This works but needs better handling error, subdomain searching isnt working
 * @param req
 * @param res
 */

 /**
 * @api {post} /createPatient Create new patient
 * @apiName createPatient
 * @apiGroup Patient
 * @apiParam {String} name Patient's name
 * @apiParam {String} phone_number Patient's phone number
 * @apiParam {String} email Patient's email
 * @apiParam {String} id Business' unique ID
 * @apiSuccess {Object} Patient New patient with information from parameters
 * @apiSuccessExample {Object} Success-Response (example):
 * HTTP/1.1 200 OK
  {
     "__v": 0,
     "name": "Thomas Powell",
     "email": "thomas@pint.com",
     "checkinDay": "March 15th 2016",
     "checkinHour": "1:27:28 pm",
     "checkinTime": "2016-03-15T20:27:28.333Z",
     "_admin_id": "56d62db4791ca1188b080c39",
     "_id": "56e87030e9519f6744190dde"
   }
 */
exports.createPatient = function(req,res) {
    var name = req.query.name;
    var phone_number = req.query.number;
    var email = req.query.email;
    var id = req.query.id;
    var subdomainurl = undefined;
    User.find({_id : id}, function(err, user){
      if(user){
        console.log(user);
          subdomainurl = user.subdomainurl;
      }
      else{
        res.status(500);
        res.json({
            type: false,
            data: "Error occured: " + err
        })
      }
    });
    // console.log("Subdomain url is " + subdomainurl);
    // if(subdomainurl != undefined) {
      Patient.create({
         "name": name,
          "phone_number" : phone_number,
          "email" : email,
          "checkinDay" : moment().format('MMMM Do YYYY') ,
          "checkinHour" : moment().format('h:mm:ss a'),
          "checkinTime" : Date.now(),
          "subdomainurl" : subdomainurl,
          "_admin_id" : id
      }, function(err, patient){
          res.json(patient);
          console.log("Sucessful");
    })
  // }
};

/**
* @api {get} /deletePatient Delete patient from business
* @apiName deletePatient
* @apiGroup Patient
* @apiParam {String} id Business' unique ID
* @apiParam {String} email Patient's email
* @apiSuccess {String} confirmation Confirmation message that you deleted the patient
* @apiSuccessExample {json} Success-Response (example):
* HTTP/1.1 200 OK
{
  "message": "Removed patient with email thomas@pint.com"
}
*/
exports.deletePatient = function(req, res){
  var email = req.query.email;
  var id = req.query.id;
  Patient.findOne({email : email}, function(err, patient) {
    if(err) {
      res.status(500);
      res.json({
          type: false,
          data: "Error occured: " + err
      })
    }
    else{
      if(patient && patient._admin_id == id){
        Patient.remove({email : email}, function (err){
          if(err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            });
          }
          else {
            res.json({
              message : "Removed patient with email " + email
            });
          }
        });
      }
    }
  })
};


/**
 * API to get all patients for certain business ID
 * @param req
 * @param res
 */

 /**
 * @api {get} /getPatients View all patients for business
 * @apiName getPatients
 * @apiGroup Patient
 * @apiParam {String} id Business' unique ID
 * @apiSuccess {Object[]} patients List of patients with name and check in time
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
           [
            {
              "name": "Juni Cortez (from Spy Kids 2)",
              "Check-In Time": "3:47:11 pm"
            },
            {
              "name": "Peter",
              "Check-In Time": "3:51:46 pm"
            },
            {
              "name": "Antonio Banderas",
              "Check-In Time": "3:51:48 pm"
            }
          ]
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

/**
* @api {post} /createEmployee Create new employee
* @apiName createEmployee
* @apiGroup Employee
* @apiParam {String} id Business' unique ID
* @apiParam {String} name Employee's name
* @apiParam {String} email Employee's email
* @apiParam {String} number Employee's phone number
* @apiSuccess {Object} Employee Creates new employee with information from parameters
* @apiSuccessExample {json} Success-Response (example):
* HTTP/1.1 200 OK
{
  "__v": 0,
  "name": "Thomas Powell",
  "phone_number": "123456789",
  "email": "tpowell@ucsd.edu",
  "password": "$2a$10$EgGQxiH3w2qK7YYTslwbpuTE8RYkJpDxsjqW.cA17h7m1TttU07O.",
  "_admin_id": "56d62db4791ca1188b080c39",
  "_id": "56e8775b350d8b70465fac3f"
}
*/
exports.createEmployee = function(req, res) {
    var name = req.query.name;
    var number = req.query.number;
    var email = req.query.email;
    var password = "password";
    var company_id = req.query.id;
    Employee.find({email: req.query.email}, function (err, employee) {
        if (employee.length == 0) {
            Employee.create({
                name: name,
                phone_number: number,
                email: email,
                password: password,
                _admin_id: new Object(company_id)
            }, function (err, employee) {
                if (err) {
                    // Send logs to logentries
                    //logger.log(4,"Create employee failed: "+err);

                    console.log("ERROR creating employee: ");
                    console.log(err);

                    //TODO - display error message
                    res.redirect('/');

                    //res.send("There was a problem adding the employee to the databaase");
                } else {
                    // Send logs to logentries
                    //logger.log(2,"Create employee Success: "+err);

                    //console.log('Creating new employee: ' + employee);
                    res.json(employee);
                    console.log("Success!");

                    //emailEmployee(employee, req.user, password);
                }
            });
        }
        else if(err) {
            res.json({"message" : err});
        }
        else {
            res.json({"message" : "Found existing employee"});
        }
      })
    };



/**
* @api {get} /getEmployees View all employees for business
* @apiName getEmployees
* @apiGroup Employee
* @apiParam {String} id Business' unique ID
* @apiSuccess {Object[]} employees List of employees with name, email, and phone number
* @apiSuccessExample {json} Success-Response (example):
* HTTP/1.1 200 OK
  [
    {
      "name": "Kevin Tran",
      "email": "ktran@ucsd.edu"
    },
    {
      "name": "Gabe Maze-Rogers",
      "email": "gmazerog@ucsd.edu"
    },
    {
      "name": "Marvin Chau",
      "email": "mchau@ucsd.edu"
    }
  ]
*/
exports.getEmployees = function(req,res) {
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
                res.json(employeeList);
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

/**
* @api {get} /deleteEmployee Delete employee from business
* @apiName deleteEmployee
* @apiGroup Employee
* @apiParam {String} id Business' unique ID
* @apiParam {String} email Employee's email
* @apiSuccess {String} confirmation Confirmation message that you deleted the employee
* @apiSuccessExample {json} Success-Response (example):
* HTTP/1.1 200 OK
{
  "message": "Removed employee with email thomas@pint.com"
}
*/
exports.deleteEmployee = function(req, res){
  var email = req.query.email;
  var id = req.query.id;
  Employee.findOne({email : email}, function(err, employee) {
    if(err) {
      res.status(500);
      res.json({
          type: false,
          data: "Error occured: " + err
      })
    }
    else{
      if(employee && employee._admin_id == id){
        Employee.remove({email : email}, function (err){
          if(err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            });
          }
          else {
            res.json({
              message : "Removed employee with email " + email
            });
          }
        });
      }
    }
  })
};
