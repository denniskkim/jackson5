/**
 * Created by zizhouzhai on 3/16/16.
 * Contains functions that query the database to populate the dashboard for Peter, business owners and employees.
 */
var Logger = require('le_node');
var logger = new Logger({
    token:'4ed0e98c-c21f-42f0-82ee-0031f09ca161'
});

var User = require('../models/User');
var Patient = require('../models/Patient');

exports.AnalyticData = {
    'count' : 19,
    'patient_count' : 87,
    'recentSignups' : [],
    'oldLogins' : []

};

exports.startAnalytics = function(){

    logger.log(1,"Starting Analytics interval loop");
    updateBusinessCount();
    updateLastSignup();
    updatePatientCount();
    updateold();

    var minutes = 15, the_interval = minutes * 60 * 1000;
    setInterval(function() {
        logger.log(1,"Updating Analytics Data");
        // do your stuff here
        updateBusinessCount();
        updateLastSignup();
        updatePatientCount();
        updateold();

    }, the_interval);


};

function updateBusinessCount(){

    User.count({}, function(err, c) {
        logger.log(1,"Business owners count = " + c);

        exports.AnalyticData.count = c;
    })

}

function updatePatientCount(){

    Patient.count({}, function(err, c) {
        logger.log(1,"Patient count = " + c);

        exports.AnalyticData.patient_count = c;
    })

}


function updateLastSignup(){

    User.find({}).sort('-signupdate').limit(5).exec(function(err, users) {
        logger.log(1,"Updating last signup companies");

        exports.AnalyticData.recentSignups = [];
        for(var i=0; i < users.length; i++) {
            exports.AnalyticData.recentSignups.push({companyname : users[i].companyname,
                email : users[i].email,
                pricingplan : users[i].pricingplanlevel?users[i].pricingplanlevel:0});
        }
    });

};

function updateold(){

    User.find({}).sort('signupdate').limit(5).exec(function(err, users) {
        logger.log(1,"Updating old Login companies");

        exports.AnalyticData.oldLogins = [];
        for(var i=0; i < users.length; i++) {

            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

            var diffDays = Math.round(Math.abs((Date.now() - users[i].signupdate)/(oneDay)));

            exports.AnalyticData.oldLogins.push({companyname : users[i].companyname,
                email : users[i].email,
                daysSince : diffDays});
        }

    });

};


//module.exports = AnalyticData;