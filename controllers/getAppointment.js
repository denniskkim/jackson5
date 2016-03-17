/**
 * Created by denniskim on 3/6/16.
 */

var moment = require('moment');
var Patient = require('../models/Patient');

exports.getAppointments = function(req,res) {
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
          //  if(req.text === _admin_id) {
                if (patients) {
                    var appointments = [];
                    var current_appointment = moment().format("MMMM Do YYYY");
                    console.log(patients.length);
                    for (var i = 0; i < patients.length; i++) {
                        var patientName = patients[i].name;
                        var checkinTime = patients[i].checkinHour;
                        patientName = "Patient Name" + ": " + patientName + " -- ";
                        checkinTime = "Check-In Time" + ": " + checkinTime;
                        var patientAppointment = patientName + checkinTime + "\n";
                        // appointments.push(patients[i].name, patients[i].checkinHour);
                        appointments.push(patientAppointment);
                    }
                    res.send(appointments);

                } // end of if (patients)
                else {
                    res.json({
                        type: false,
                        data: "bad"
                    })
                }
        }
    })
};

exports.deletePatient = function(req,res){
    Patient.find
}