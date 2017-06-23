/* app.js */

// require and instantiate express
var express = require('express');
var app = express()

var port = process.env.PORT || 8080
var bodyParser   = require('body-parser');
var session      = require('express-session');
const MongoStore = require('connect-mongo')(session);
var mongoose     = require('mongoose');
var flash        = require('connect-flash');
var configDB     = require('./config/database.js');
// configuration ===============================================================
var connection = mongoose.connect(configDB.url); // connect to our database
// use js promise
mongoose.Promise = global.Promise
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

var passport     = require('passport')
require('./config/passport')(passport);


app.use(express.static('public'))
app.use('/bower_components',  express.static('bower_components'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(session({ 
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

// set the view engine to ejs
app.set('view engine', 'ejs') 

// test routing
require('./routes/test.js')(app)

/// AUTH ROUTING
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: true,
                                   successFlash: 'Logged in' })
);

app.get('/logout', function(req, res){
  req.logout();
  req.flash("success", "Logged out.")
  res.redirect('/');
});
/////

//// Other routing
// homepage first to handle auth redirects correctly
require('./routes/home.js')(app)
require('./routes/addPatient.js')(app); 
require('./routes/addVisit.js')(app); 
require('./routes/patientSearch.js')(app);
require('./routes/patient.js')(app)

app.listen(port)

console.log('listening on port ' + port)