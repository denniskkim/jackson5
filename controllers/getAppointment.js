/**
 * Created by denniskim on 3/6/16.
 */

var Patient = require('../models/Patient');
var moment = require('moment');
/**
 *
 * @param req
 * @param res
 */

exports.getAppointment = function(req,res){
    Patient.find({}, function(err,patients) {
       if(err){
           res.status(500);
           res.json({
               type: false,
               data: "Error occured: " + err
           })
       }
       if(req.token !== N9Gr8XZR1N4jvC5wWw09Khui){


       }
        else{
           if(patients){
               var appointments = [];
               var appointmentCheck = moment.format('MMMM Do YYYY');

               for(var i = 0; i < patients.length; i++){
                   appointments.push(patients[i].name, patients[i].checkinTime);
               }
               res.json(appointments.toString());
               res.send('Divider');
               res.send(appointments.toString());
               //res.json({type: true,
               //         data: "Test" + req.text});
           }
           else{
               res.json({
                   type:false,
                   data: "bad"
               })
           }
       }
    });
};