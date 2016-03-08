/**
 * Created by zizhouzhai on 2/28/16.
 */
var Patient = require('../models/Patient');
var nodemailer = require('nodemailer');
var _ = require('lodash');
var async = require('async');
var nodemailer = require('nodemailer');
var passport = require('passport');
var fs = require('fs');
var validator = require('validator');

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


exports.removePatient = function(req, res) {
    Patient.findById(req.params.id, function(err, patient) {
        if (err) {
            console.log("ERROR selecting patient: " + patient);
            //res.send("There was an error selecting the employee");
        } else {
            patient.remove(function (err, patient) {
                if (err) {
                    console.log("ERROR removing patient: " + patient);
                    //res.send("There was an error removing the employee");
                } else {
                    console.log("Successfully removed " + patient.name);
                    res.redirect("/patient_queue");
                }
            })
        }
    })
};

exports.notifyPatients = function(req, res) {
    
    Patient.find({_id: req.body.currentID}, function(err, patient) {
        if (err) {
            console.log("ERROR selecting patient: " + patient);
            //res.send("There was an error selecting the employee");
        } else {
            console.log("THis testing for " + req.body.currentID);
            if(patient.name) {
            console.log("patient: " + patient);
            var options = {
                service: 'gmail',
                auth: {
                user: 'donotreply.receptional@gmail.com',
                pass: 'nightowls1'
                }
            };
            var emailtext = "Hello " +patient.name + " You are next. Please Come Forward !!!";
            var transporter = nodemailer.createTransport(options);
            // Setup email data
            var mailOptions = {
                from: '"Receptional.xyz" <donotreply.receptional@gmail.com>',
                to: patient.email,
                subject: "Welcome to Receptional",
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

            // Twilio Credentials 
            var accountSid = 'AC3008bf6b293131cc5a4c8410a1a5ceb8'; 
            var authToken = '63d3c91c8c7f774d0733ea16ccea533b'; 

            //require the Twilio module and create a REST client 
            var client = require('twilio')(accountSid, authToken); 
              client.sendSms({ 
                body: "Hello " +patient.name + " You are next. Please Come Forward !!!",
                to: "+18583808909",
                from: "+18583467675"
              }, function(err, message) { 
                if(err){
                  console.log(err.message); 
                }
              });

            }
            res.redirect("/patient_queue");
        }
    });
    

};