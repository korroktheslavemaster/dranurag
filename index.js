/* app.js */

// require and instantiate express
var express = require('express');
var app = express()

var port = process.env.PORT || 8080
var bodyParser   = require('body-parser');
var session      = require('express-session');
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
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(session({ 
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

// set the view engine to ejs
app.set('view engine', 'ejs')

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
 
// testing princexml

app.get('/prince', function(req, res) {
  var bin = process.env.PRINCE_BIN || "node_modules/prince/prince/lib/prince/bin/prince"
  const fs = require('fs');
  var exec = require('child_process').exec;
  var cmd = bin + " test.html -o test2.pdf"
  exec(cmd, function(error, stdout, stderr) {
    // command output is in stdout
    console.log(stdout)
    console.log(error)
    console.log(stderr)
    if (error) {
      req.flash('error', error)
      res.send("NOTOK")
    }
    fs.readFile('test2.pdf', function (err,data){
      res.contentType("application/pdf");
      res.send(data);
    });
  });
})
 
// testing docraptor

app.get('/docraptor', function(req, res) {
  var request = require('request');
  var fs = require('fs');
  var content = "<html><body>TEST!</body></html>";

  config = {
    url: 'https://docraptor.com/docs',
    encoding: null, //IMPORTANT! This produces a binary body response instead of text
    headers: {
      'Content-Type': 'application/json'
    },
    json: {
      user_credentials: "Vuh4JHZczTgYYFbECgw",
      doc: {
        document_content: content,
        type: "pdf",
        test: true,
        // prince_options: {
        //   media:   "screen",          // use screen styles instead of print styles
        //   baseurl: "http://hello.com" // URL to use for generating absolute URLs for assets from relative URLs
        // }
      }
    }
  };

  request.post(config, function(err, response, body) {
      fs.writeFile('doc_raptor_sample.pdf', body, "binary", function(writeErr) {
        res.contentType("application/pdf");
        res.send(body);
        // fs.readFile('doc_raptor_sample.pdf', function (err,data){
          
        // });
        console.log('Saved!');
    });
  });
})
app.listen(port)

console.log('listening on port ' + port)