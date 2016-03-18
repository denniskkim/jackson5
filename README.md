# Receptional [![Build Status](https://codeship.com/projects/411647d0-c246-0133-543e-66aebc4c133d/status?branch=master)](https://codeship.com/projects/411647d0-c246-0133-543e-66aebc4c133d/status?branch=master)

# How to install
1. Download the repo
2. Make sure you're into the jackson5 directory 
3. `npm install`


# You will need a .env file. Ask team leads about this
1. the .env file will go in the root directory of the app
2. it will be used to store server configurations (we used (https://mlab.com/)[https://mlab.com/] )
3. __This .env file should never be pushed to github__

# How To run entire app 
1. npm start
2. This will run on port 3000 and you can access the web app at (http://localhost:3000/)[http://localhost:3000/]

# How to test our app
1. npm test
2. This will run all of our tests cases in test/app.js

# How to build the API Docs
1. Go to the root of the project
2. apidoc -i controllers/ -o apidoc/ -t template/ 
3. This will build new API docs that will be located in apidoc/

API Documentation is located at (http://receptional.s3-website-us-west-1.amazonaws.com/)[http://receptional.s3-website-us-west-1.amazonaws.com/]
