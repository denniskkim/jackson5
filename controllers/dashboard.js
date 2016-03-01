/**
 * Created by zizhouzhai on 3/1/16.
 */

exports.getEmployeeDashboard = function(req, res) {
    if (!req.user) {

        return res.redirect('/login');
    }
    res.render('dashboard_employee');
};

exports.getBusinessOwnerDashboard = function(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }
    res.render('dashboard_admin');
};
