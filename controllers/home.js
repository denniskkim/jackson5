/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  //res.render('home', {
  //  title: 'Home'
  //});
  res.render('landing_page');
};