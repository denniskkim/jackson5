var crypto = require('crypto');
var Employee = require('../models/Employee');
var baby = require('babyparse');
/**
 * GET /add_employees
 * Employees page.
 */
exports.getEmployees = function(req, res){
    Employee.find({_admin_id: req.user.id/*, name: "Jane Doe"*/}, function (err, employees) {

        if (err) { return next(err);  }
        if(!employees) { return next(new Error('Error finding employee'));}

        //console.log(employee);
        res.render('add_employees',{title: 'Add Employees', employees: employees});
    });
};

/**
 * POST /add_employees
 * Add an employee using form.
 */
exports.addEmployee = function(req, res) {
    Employee.create({
        name: req.body.name,
        phone_number: req.body.number,
        email: req.body.email,
        _admin_id: req.user.id
    }, function (err, employee) {
        if (err) {
            console.log("ERROR creating employee: " + employee);
            //res.send("There was a problem adding the employee to the databaase");
        } else {
            //console.log('Creating new employee: ' + employee);
            res.redirect('add_employees');
        }
    });

    // TODO: send email notification

};

// TODO: create a file input in html
exports.addEmployeesThroughCSV = function(req, res) {
    var parsed = baby.parse(req.body.file);
    var rows = parsed.data;
    var admin_id = req.user.id;


    for(var i = 0; i < rows.length; i++){
        var name = rows[i][0];
        var phone = rows[i][1];
        var email = rows[i][2];
        Employee.create({
            name: name,
            phone_number: phone,
            email: email,
            _admin_id: admin_id
        }, function (err, employee) {
            if (err) {
                console.log("ERROR creating employee: " + employee);
                //res.send("There was a problem adding the employee to the databaase");
            }}
        );


        // TODO: send email notification
    }
    res.redirect('/add_employees');
};

exports.selectEmployee = function(req, res) {
    Employee.findById(req.id, function(err, employee) {
        if (err) {
            console.log("ERROR selecting employee: " + employee);
            //res.send("There was an error selecting the employee");
        } else {
            res.render('editEmployee', {title: "Employee: " + employee.name, employee: employee});
        }
    })
};

exports.editEmployee = function(req, res) {
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;

    Employee.findById(req.id, function(err, employee) {
        if (err) {
            console.log("ERROR selecting employee: " + employee);
            //res.send("There was an error selecting the employee");
        } else {
            employee.update({
                name: name,
                phone_number: phone,
                email: email
            }, function(err, employee) {
                if (err) {
                    console.log("ERROR updating employee: " + employee);
                    //res.send("There was an error updating the employee");
                } else {
                    res.redirect("/add_employees");
                }
            })
        }
    })
};

exports.removeEmployee = function(req, res) {
    Employee.findById(req.id, function(err, employee) {
        if (err) {
            console.log("ERROR selecting employee: " + employee);
            //res.send("There was an error selecting the employee");
        } else {
            employee.remove(function (err, employee) {
                if (err) {
                    console.log("ERROR removing employee: " + employee);
                    //res.send("There was an error removing the employee");
                } else {
                    console.log("Successfully removed " + employee.name);
                    res.redirect("/add_employees");
                }
            })
        }
    })
};