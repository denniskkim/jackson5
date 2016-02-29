/**
 * Created by zizhouzhai on 2/28/16.
 */
var Patient = require('../models/Patient');

/**
 * Add an patient using form.
 */
exports.addPatient = function(req, res) {
    Patient.create({
        name: req.body.name,
        phone_number: req.body.number,
        email: req.body.email,
        checkinTime: Date.now(),
        _admin_id: req.user.id
    }, function (err, patient) {
        if (err) {
            console.log("ERROR creating patient: " + patient);
            //res.send("There was a problem adding the employee to the databaase");
        } else {
            //console.log('Creating new patient: ' + patient);
            res.redirect('add_patient');
        }
    });

};

exports.getPatients = function(req, res) {


    Patient.find({_admin_id: req.user.id}, function (err, patients) {

        if (err) { return next(err);  }
        if(!patients) { return next(new Error('Error finding patients'));}

        console.log(patients);
        res.render('patient_queue',{patients : patients});
    });


}