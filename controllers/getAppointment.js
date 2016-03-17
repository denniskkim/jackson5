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
                        var patient_name = "Patient Name";
                        var check_time =  "Check-In Time"
                        var patientName = patients[i].name;
                        var checkinTime = patients[i].checkinHour;
                        patientName = patient_name + ": " + patientName + " -- ";
                        checkinTime = check_time + ": " + checkinTime;
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
                } // end of else (patients)
          //  }

            //else{
            //    if(res.text !== _admin_id) {
            //        res.send('Incorrect Admin ID. Please check again to make sure it is correct');
            //    }
            //    else if(res.text === null){
            //        res.send('Please enter your Admin ID');
            //    }
            //}
        }
    })
};