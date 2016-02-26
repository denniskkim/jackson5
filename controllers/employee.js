// straight from Gold Team's repo
// TODO: modify to work with Jackson Five

var crypto = require('crypto');
var Employee = require('../models/Employee');
//var baby = require('babyparse');
//var ObjectId = require('mongodb').ObjectID;

/**
 * GET /add_employees
 * Employees page.
 */
exports.get = function(req, res){
    //var database =  req.db;
    //var employeeDB = database.get('employees');
    //var businessID = req.user[0]._id.toString();

    Employee.find({name: "Jane Doe"}, function (err, results) {
    //employeeDB.find({/*_admin_id: ObjectId(businessID)*/ name: "Jane Doe"},function (err,results){

        if (err) { return next(err);  }
        if(!results) { return next(new Error('Error finding employee'));}

        employee = results;
        console.log(employee);
        res.render('add_employees',{title: 'Add Employees', employees: employee});
    });
}

exports.addEmployee = function(req, res) {
    var employee = new Employee({
        name: req.body.name,
        phone_number: req.body.number,
        email: req.body.email
    });
}

exports.addEmployeesThroughCSV = function(req, res) {

}

/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *  Allows the User to input specified data and make changes
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
/*exports.post = function(req,res){
    var parsed = baby.parse(req.body.csvEmployees);
    var rows = parsed.data;
    var database =  req.db;
    var employeeDB = database.get('employees');
    var businessID = req.user[0].business;


    for(var i = 0; i < rows.length; i++){
        var username = rows[i][0];
        var email = rows[i][1];
        var nameArr = username.split(' ');
        var fname = nameArr[0];
        var lname = nameArr[1];
        var token = randomToken();
        employeeDB.insert({
            business: ObjectId(businessID),
            fname: fname,
            lname: lname,
            email: email,
            registrationToken : token,
            admin: false
        });


        // TODO: send email notification
    }
    res.redirect('/add_employees');
}


function randomToken() {
    return crypto.randomBytes(24).toString('hex');
}*/