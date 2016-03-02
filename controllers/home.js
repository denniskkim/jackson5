/**
 * GET /
 * Home page.
 */

var User = require('../models/User');

exports.index = function(req, res) {

  var booleanHolder = 0;

  var domain = req.headers.host,
      subDomain = domain.split('.');

  if(subDomain.length > 2){
  //User.findOne({ subdomainurl: subDomain }, function(err, user) {
  //  booleanHolder = 1;
  //});

  //if(booleanHolder == 1){
    subDomain = subDomain[0].split("-").join(" ");
    if (req.user) {
      return res.redirect('/dashboard_employee');
    }
    else{
      res.redirect('/login_employee');
    }

  }
  else{
    if (req.user) {
      return res.redirect('/dashboard_admin');
    }
    else{
      res.render('home');
    }
  }




};
