/**
 * Created by denniskim on 3/6/16.
 */

var moment = require('moment');
var Patient = require('../models/Patient');

exports.getAppointment = function(req,res) {
    //_id: req.query.id
    Patient.find({}, function (err, patients) {
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