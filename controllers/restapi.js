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
    Patient.find({_id: req.query.id}, function (err, patients) {
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
                    var patient = 'Name: ' + patientName;

                    var checkin_time = patients[i].checkinHour;
                    //if(checkin_time === null){
                    //    checkin_time = 'Error when checked-in';
                    //    //add log message TODO
                    //}
                    var checkin = 'Check-in Time: ' + checkin_time;
                    // appointments.push(patients[i].name, patients[i].checkinHour);
                    appointments.push(patient, checkin);
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
 * TODO THIS ID IS WRONG
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
                    employeeList.push(employees[i].name, employees[i].email, employees[i].phonenumber);
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
