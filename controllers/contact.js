var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'donotreply.receptional@gmail.com',
    pass: 'nightowls1'
  }
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = function(req, res) {

  var to = req.body.email;
  var name = req.body.name;
  var body = req.body.message;
  var from = 'donotreply.receptional@gmail.com';
  var subject = req.body.subject ;

  var mailOptions = {
    to: to,
    from: from,
    subject: subject,
    text: body
  };
  
  transporter.sendMail(mailOptions, function(err) {
    if (err) {
      req.flash('errors', { msg: err.message });
      console.log(err);
      return res.redirect('/contact');
    }
    console.log("success");
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
};
