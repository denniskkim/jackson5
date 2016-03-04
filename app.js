/**
 * Module dependencies.
 */
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var logger = require('morgan');
var async = require('async');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var dotenv = require('dotenv');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var _ = require('lodash');
var http = require('http');
var subdomain = require('express-subdomain');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load();

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var employeeController = require('./controllers/employee');
var patientController = require('./controllers/patient');
var dashboardController = require('./controllers/dashboard');

/**
 * API keys and Passport configuration.
 */
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.engine('handlebars', handlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));

app.use(passport.initialize());
app.use(passport.session());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(lusca({
  csrf: false,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

//grabbing subdomain
/* TODO: check if the account was verified */
//app.use(subdomain('api', router));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get('/add_Employees', employeeController.getEmployees);
app.post('/add_Employees', employeeController.addEmployee);
app.post('/add_EmployeesCSV', upload.single('file'), employeeController.addEmployeesThroughCSV);

app.get('/login_employee', employeeController.getEmployeeLogin);
app.post('/login_employee', employeeController.postEmployeeLogin);
app.delete('/delete/:id', employeeController.removeEmployee);

app.post('/form', passportConf.isAuthenticated, userController.postUpdateForm);

/**
app.post('/add_patient', patientController.addPatient);
app.get('/patient_queue', patientController.getPatients);
app.get('/patient_queueE', patientController.getPatientsE);
**/
app.post('/patients_mode', patientController.addPatient);
app.get('/patients_mode', function(req, res){
  res.render('patients_mode');
});

app.get('/patient_queue', patientController.getPatients);

app.get('/dashboard_admin', dashboardController.getBusinessOwnerDashboard);
app.get('/dashboard_employee', dashboardController.getEmployeeDashboard);

app.get('/subdomain_login', function(req, res){
  res.render('subdomain_login', { employee: req.employee });
});
app.post('/subdomain_login', employeeController.postSubdomain);


/**
 * API examples routes.
 */

app.get('/viewbusinesses', userController.viewBusinesses);
app.get('/api', apiController.getApi);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);

app.get('/Billing_info', function(req, res){
  res.render('Billing_info', { user: req.user });
});
app.get('/add_employees', function(req, res){
  res.render('add_employees', { user: req.user });
});
app.get('/form', function(req, res){
  res.render('form', { user: req.user });
});
app.get('/management', function(req, res){
  res.render('management', { user: req.user });
});

app.get('/about', function(req, res){
  res.render('about', { user: req.user });
});

app.get('/dashboard', function(req, res){
  res.render('dashboard', { user: req.user });
});

app.get('/settings', function(req, res){
  res.render('settings', { user: req.user });
});

app.get('/viewform', function(req, res){
  res.render('viewform', { form: req.user.form });
});

// Twilio Credentials 
var accountSid = 'AC3008bf6b293131cc5a4c8410a1a5ceb8'; 
var authToken = '63d3c91c8c7f774d0733ea16ccea533b'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

  app.post('/test', function(req, res) {
        console.log(accountSid);
        console.log(authToken);
      client.sendSms({ 
        body: req.body.message,
        to: req.body.to,
        from: "+18583467675"
      }, function(err, message) { 
        console.log(message); 
        if(err){
          console.log(err.message);
          console.log(err.message); 
          res.render('test', { messageinfo: "fail sent" });
        }
      });

      res.render('test', { messageinfo: " sent" });

  });



app.get('/test', function(req, res){
  res.render('test', { user: req.user });
});

/**
 * OAuth authentication routes. (Sign in)
 */

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});


/**
 * OAuth authorization routes. (API examples)
 */

/**
 * Error Handler.
 */
 
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});

module.exports = app;
