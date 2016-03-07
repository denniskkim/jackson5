/**
 * Created by zizhouzhai on 2/28/16.
 */
var Patient = require('../models/Patient');

var moment = require('moment');


/**
 * Add an patient using form.
 */
exports.addPatient = function(req, res) {

    Patient.create({
        name: req.body.name,
        phone_number: req.body.number,
        email: req.body.email,
        checkinDay: moment().format('MMMM Do YYYY') ,
        checkinHour: moment().format('h:mm:ss a'),
        /*
         checkinDay: moment().format('MMMM Do YYYY') ,
         checkinHour: moment().subtract(Date.now().getTimezoneOffset(),'hour').format('h:mm:ss a'),
         */
        checkinTime: Date.now(),
        subdomainurl: req.user.subdomainurl,
        _admin_id: req.user.id
    }, function (err, patient) {
        if (err) {
            console.log("ERROR creating patient: " + err);
            //res.send("There was a problem adding the employee to the databaase");
        } else {
            //console.log('Creating new patient: ' + patient);
            res.render('patients_mode',{msg: 'Thanks for checking in, please wait!!!'});
        }
    });

};



exports.getPatients = function(req, res) {


    Patient.find({subdomainurl: req.user.subdomainurl }, function (err, patients) {

        if (err) { return next(err);  }
        if(!patients) { return next(new Error('Error finding patients'));}

        console.log(patients);
        res.render('patient_queue',{patients : patients, layout: 'navigation_admin'});
    });


}


exports.getPatientsE = function(req, res) {


    Patient.find({_admin_id: req.user.id}, function (err, patients) {

        if (err) { return next(err);  }
        if(!patients) { return next(new Error('Error finding patients'));}

        console.log(patients);
        res.render('patient_queue',{patients : patients, layout: 'navigation_employee'});
    });


}