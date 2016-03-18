var request = require('supertest');
var app = require('../app.js');
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://receptional.xyz");

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /login', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /contact', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});

describe('GET /getPatients', function(){
  it("should return list of patients", function(done){
    request(app)
      .get("/getPatients?id=56d62db4791ca1188b080c39")
      .expect("Content-type",/json/)
      .expect(200, done);
  });
});

describe('GET /getPatients', function(){
  it("should fail to list all patients (None for account)", function(done){
    request(app)
      .get("/getPatients?id=1")
      .expect("Content-type",/json/)
      .expect(500,done);
  })
});

describe('POST /createPatient', function(){
  it("should create a new patient", function(done){
    request(app)
      .post("/createPatient?name=T-Pizzle&phone_number=123456789&email=thomas@pint.com&id=56d62db4791ca1188b080c39")
      .expect("Content-type",/json/)
      .expect(200, done);
  })
});

describe('GET /checkoutPatient', function(){
  it("should check out employee that was just created", function(done){
    request(app)
      .get("/checkoutPatient?email=thomas@pint.com&id=56d62db4791ca1188b080c39")
      .expect("Content-type",/json/)
      .expect(200,done);
  })
});

describe('GET /checkoutPatient', function(){
  it("should fail to checkout a patient (duplicate)", function(done){
    request(app)
      .get("/checkoutPatient?id=56d62db4791ca1188b080c39&email=thomas@pint.com")
      .expect("Content-type",/json/)
      .expect(500, done);
  })
});

describe('GET /deletePatient', function(){
  it("should delete a patient", function(done){
    request(app)
      .get("/deletePatient?id=56d62db4791ca1188b080c39&email=thomas@pint.com")
      .expect("Content-type",/json/)
      .expect(200, done);
  })
});

describe('GET /deletePatient', function(){
  it("should fail to delete a patient (duplicate)", function(done){
    request(app)
      .get("/deletePatient?id=56d62db4791ca1188b080c39&email=thomas@pint.com")
      .expect("Content-type",/json/)
      .expect(500, done);
  })
});

describe('POST /createEmployee', function(){
  it("should create a new employee", function(done){
    request(app)
      .post("/createEmployee?email=jackson5@gmail.com&number=123456789&name=Unit Test&id=56d62db4791ca1188b080c39")
      .expect("Content-type",/json/)
      .expect(200, done);
  })
});

describe('GET /getEmployees', function(){
  it("should list all employees", function(done){
    request(app)
      .get("/getEmployees?id=56d62db4791ca1188b080c39")
      .expect("Content-type",/json/)
      .expect(200,done);
  })
});

describe('GET /getEmployees', function(){
  it("should fail to list all employees (None for account)", function(done){
    request(app)
      .get("/getEmployees?id=1")
      .expect("Content-type",/json/)
      .expect(500,done);
  })
});

describe('POST /createEmployee', function(){
  it("should fail to create a new employee (duplicate)", function(done){
    request(app)
      .post("/createEmployee?email=jackson5@gmail.com&number=123456789&name=Unit Test&id=56d62db4791ca1188b080c39")
      .expect("Content-type",/json/)
      .expect(500, done);
  })
});

describe('GET /deleteEmployee', function(){
  it("should delete employee that was just created", function(done){
    request(app)
      .get("/deleteEmployee?email=jackson5@gmail.com&id=56d62db4791ca1188b080c39")
      .expect("Content-type",/json/)
      .expect(200,done);
  })
});

describe('GET /deleteEmployee', function(){
  it("should fail to delete employee that was just created (duplicate)", function(done){
    request(app)
      .get("/deleteEmployee?email=jackson5@gmail.com&id=56d62db4791ca1188b080c39")
      .expect("Content-type",/json/)
      .expect(500,done);
  })
});
