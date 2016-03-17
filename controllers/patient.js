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
        checkoutTime: null,
        checkedout: false,
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


    Patient.find({subdomainurl: req.user.subdomainurl, checkedout: false }, function (err, patients) {

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
            patient.checkoutTime = Date.now();
            patient.checkedout = true;
            patient.save();

            //patient.remove(function (err, patient) {
            //    if (err) {
            //        console.log("ERROR removing patient: " + patient);
            //        //res.send("There was an error removing the employee");
            //    } else {
            //        console.log("Successfully removed " + patient.name);
            //        res.redirect("/patient_queue");
            //    }
            //})
        }
    })
};

exports.deletePatientSlack = function(req,res){
    console.log(req.text);
  Patient.find({}, function(err, patient){
      if(err){
          console.log("Error selecting patient: " + patient);
          res.send("Sorry patient does not exist");
      }
      else {
          if(patient) {
              console.log("This is the error rororororor");
              //res.send("Parameter1" + req.text);
              //for (var i = 0; i < patient.length; i++) {
              //    res.send("Parameter" + req.text);
              //    if (patient[i].name === req.text) {
              //        patient.remove(function (err, patient) {
              //            if (err) {
              //                console.log("ERROR removing patient: " + patient);
              //                res.send("ERROR removing patient: " + patient);
              //                //res.send("There was an error removing the employee");
              //            } else {
              //                console.log("Successfully removed " + patient.name);
              //                res.send("Successfully removed patient " + patient.name);
              //                //res.redirect("/patient_queue");
              //            }
              //        })
              //    }
              //}
          }

          else{
              res.send("There is currently no visitors");
          }
          res.send("Removing Patient");
      }// end of else
  })
};

exports.notifyPatients = function(req, res) {
    
    Patient.find({email: req.body.currentID}, function(err, patient) {
        if (err) {
            console.log("ERROR selecting patient: " + patient);
            //res.send("There was an error selecting the employee");
        } else {
            var options = {
                service: 'gmail',
                auth: {
                user: 'donotreply.receptional@gmail.com',
                pass: 'nightowls1'
                }
            };
            var emailtext = "Hello " +req.body.name + " You are next. Please Come Forward !!!";
            var transporter = nodemailer.createTransport(options);
            // Setup email data
            var mailOptions = {
                from: '"Receptional.xyz" <donotreply.receptional@gmail.com>',
                to: req.body.currentID,
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
                body: "Hello " +req.body.name + " You are next. Please Come Forward !!!",
                to: "+18583808909",
                from: "+18583467675"
              }, function(err, message) { 
                if(err){
                  console.log(err.message); 
                }
              });
            res.redirect("/patient_queue");
        }
    });
    

};