var mongoose = require('mongoose');

var businessOwnerSchema = new mongoose.Schema({
    subdomain : String,
    companyName : String,
    name : String,
    email : String,
    pricingPlanLevel : Number,
    phone_number: String, /* or Number */
    dateCreated : Date,
    id: String,
    _admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
});

module.exports = mongoose.model('BusinessOwner', businessOwnerSchemaSchema);


/**
 * Subdomain URL
 Company Name
 Business Owner Name
 Email
 Password
 ID (Automatically assigned)
 Phone Number
 Pricing Plan Level
 Free, Basic, Premium
 Future Plan
 Payment information (PayPal)

 */