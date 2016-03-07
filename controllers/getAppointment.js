/**
 * Created by denniskim on 3/6/16.
 */

var Patient = require('../models/Patient');
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
        else{
           if(patients){
               var appointments = [];
               for(var i = 0; i < patients.length; i++){
                   appointments.push(patients[i].name, patients[i].checkinTime);
               }
               res.json(appointments);
               res.json({type: true,
                        data: "Test" + req.text});
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