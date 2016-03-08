/**
 * Created by zizhouzhai on 2/28/16.
 */
var mongoose = require('mongoose');

var patientSchema = new mongoose.Schema({
    name: String,
    phone_number: String, /* or Number */
    email: String,
    id: String,
    checkinDay: String,   /* grabs the day of appointment */
    checkinHour: String,  /* grabs the time of appointment */
    checkinTime: Date,
    checkoutTime: Date,
    subdomainurl: String,
    _admin_id: String
});

module.exports = mongoose.model('Patient', patientSchema);