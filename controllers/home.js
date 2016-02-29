/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {

  var domain = req.headers.host,
      subDomain = domain.split('.');

  if(subDomain.length > 1){
    subDomain = subDomain[0].split("-").join(" ");

    res.render('account/login', {
      companyname: subDomain
    })
  }
  else{
    res.render('home');
  }




};