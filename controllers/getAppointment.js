/**
 * Created by denniskim on 3/6/16.
 */

var Patient = require('../models/Patient');

exports.getAppointment = function(req,res){
    Patient.find({ _id : req.query.id}, function(err,patients) {
       if(err){
           res.status(500);
           res.json({
               type: false,
               data: "Error occured: " + err
           })
       }
        else{
           if(patients){
               var appointments = [];
               console.log(patients.length);
               for(var i = 0; i < patients.length; i++){
                   appointments.push(patients[i].name, patients[i].checkinTime);
               }
               res.json(appointments);
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