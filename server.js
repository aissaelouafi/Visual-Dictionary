var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var pg = require('pg');
var jwt = require('jsonwebtoken'); // create, sign and verify tokens
var morgan = require('morgan');
var bcrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');
var session = require('express-session');
var app = express();
var passport = require('passport');

// import config
var config = require('./config/config')

// Models import
var User = require('./models/User.js')

// Configure bodyParser to get data from post query
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: config.secret }));

// Configuration and db connexion
var port = process.env.PORT || 4400;

// Use morgan to log requests on the console
app.use(morgan('dev'));
app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('superSecret',config.secret); // Secret variables

// Passport configuration
app.use(session({secret : config.superSecret}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport)
require('./routes/routes')(app,passport)
require('./routes/routes_api')(app,passport)

app.listen(port);
console.log('LogAnalysisWebApp happens on port '+port);
