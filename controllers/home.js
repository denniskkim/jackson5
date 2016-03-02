/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {

  var domain = req.headers.host,
      subDomain = domain.split('.');

  if(subDomain.length > 2){
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