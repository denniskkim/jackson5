var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    name: String,
    phone_number: String, /* or Number */
    email: String,
    id: String,
    admin: Boolean,
    _admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);