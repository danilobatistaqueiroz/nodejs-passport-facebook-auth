const passport = require('passport')
var BasicStrategy = require('passport-http').BasicStrategy
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {dashboard,profile}=require('./app')


const clc = require("cli-color")
const cError = clc.red;
const cWarning = clc.yellow;
global.fault = (...f) => console.error(cError(f));
global.warning = (...w) => console.error(cWarning(w));

const auth = require('./auth')

app.use(bodyParser.urlencoded({ extended: true })); 

passport.use(new BasicStrategy(auth.verify))

app.use(auth.printData)

app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/oauth2/redirect/facebook',
  passport.authenticate('facebook', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/profile');
  });

app.get('/profile', checkUserPass, profile)

/****************************** se passa username and password no request headers authorization basic ******************************* */
app.listen(3000, () => console.log(`app is now running on port 3000`))
