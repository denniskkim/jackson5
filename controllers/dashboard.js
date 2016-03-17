/**
 * Created by zizhouzhai on 3/1/16.
 */

var Analytics = require('../controllers/analytics');
var Patient = require('../models/Patient');

exports.getEmployeeDashboard = function(req, res) {
    if (!req.user) {

        return res.redirect('/login_employee');
    }
    res.render('dashboard_employee',{user : req.user, layout: 'navigation_employee'});
};

exports.getBusinessOwnerDashboard = function(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }

    Patient.find({_admin_id: req.user.id }).sort('-checkinTime').exec(function(err, patients) {

        if (err) { return next(err);  }
        if(!patients) { return next(new Error('Error finding patients'));}
        res.render('dashboard_admin', {user : req.user, layout: 'navigation_admin', patients : patients});
    });

};

exports.getPeterDashboard = function(req, res) {


    if (!req.user || req.user.email != "petervenkmen@ghostbusters.com") {
        return res.redirect('/login');
    }

    res.render('dashboard_peter', {user : req.user, layout: 'navigation_peter', analyticData : Analytics.AnalyticData});

};
