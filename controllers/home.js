/**
 * GET /
 * Home page.
 */

var User = require('../models/User');
var express = require('express');
var subdomain = require('express-subdomain');

var app = express();

var router = express.Router();

var sub_verify = 0;
var subdomain_finder;

exports.index = function(req, res) {
   var domain = req.headers.host,
       subDomain = domain.split('.');

  //User.findOne({ subdomainurl: subDomain }, function(err, user) {
  //  sub_verify = 1;
  //  console.log(user);
  //});


  //
  //router.get('/', function(req, res) {
  //  res.send('Welcome to our API!');
  //});

  //if(subDomain.length >2 ){
  ////  app.use(subdomain(subDomain, router));
  //  if (req.user) {
  //    return res.redirect('/dashboard_employee');
  //  }
  //  else{
  //    res.redirect('/login_employee');
  //  }
  //}
  //else {
    if (req.user) {
      if(req.user._admin_id)
        return res.redirect('/dashboard_employee');
      else{
          if(req.user.email === "petervenkmen@ghostbusters.com") {
              return res.redirect('/dashboard_peter');
          }
          else{
              return res.redirect('/dashboard_admin');
          }
      }
    }
    else {
      res.render('home');
    }
  //}
};



//var booleanHolder = 0;
//
//var domain = req.headers.host,
//    subDomain = domain.split('.');
//
////if(subDomain.length > 2){
////User.findOne({ subdomainurl: subDomain }, function(err, user) {
////  booleanHolder = 1;
////  app.use(subdomain(user.subdomainurl, router));
////});
////
//////if(booleanHolder == 1){
////  subDomain = subDomain[0].split("-").join(" ");
////  if (req.user) {
////    return res.redirect('/dashboard_employee');
////  }
////  else{
////    res.redirect('/login_employee');
////  }
////
////}
//
//User.findOne({subdomainurl: subDomain}, function(err,user){
//  app.use(subdomain(user.subdomainurl, router));
//});
////else{