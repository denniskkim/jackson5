/**
 * Created by zizhouzhai on 3/1/16.
 */

var Analytics = require('../controllers/analytics');
var Patient = require('../models/Patient');

exports.getEmployeeDashboard = function(req, res) {
    if (!req.user) {

        return res.redirect('/login_employee');
    }

    Patient.find({_admin_id: req.user._admin_id }).sort('-checkinTime').exec(function(err, patients) {

        console.log(patients);

        var count = 0;
        var totaltime = 0;
        for(var i=0; i < patients.length; i++) {

            if(patients[i].checkoutTime != null){

                var diffDays = Math.round(Math.abs((patients[i].checkoutTime - patients[i].checkinTime)/(60*1000)));
                console.log(diffDays);
                totaltime += diffDays;
                count++;
            }

        }

        if (err) { return next(err);  }
        if(!patients) { return next(new Error('Error finding patients'));}
        res.render('dashboard_employee', {user : req.user, layout: 'navigation_employee', patients : patients, avg_time : Math.round(totaltime/count), waiting : patients.length - count});
    });


};

exports.getBusinessOwnerDashboard = function(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }

    Patient.find({_admin_id: req.user.id }).sort('-checkinTime').exec(function(err, patients) {

        var count = 0;
        var totaltime = 0;
        for(var i=0; i < patients.length; i++) {

            if(patients[i].checkoutTime != null){

                var diffDays = Math.round(Math.abs((patients[i].checkoutTime - patients[i].checkinTime)/(60*1000)));
                console.log(diffDays);
                totaltime += diffDays;
                count++;
            }

        }

            if (err) { return next(err);  }
        if(!patients) { return next(new Error('Error finding patients'));}
        res.render('dashboard_admin', {user : req.user, layout: 'navigation_admin', patients : patients, avg_time : Math.round(totaltime/count), waiting : patients.length - count});
    });

};

exports.getPeterDashboard = function(req, res) {


    if (!req.user || req.user.email != "petervenkmen@ghostbusters.com") {
        return res.redirect('/login');
    }

    res.render('dashboard_peter', {user : req.user, layout: 'navigation_peter', analyticData : Analytics.AnalyticData});

};
