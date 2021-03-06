/* app.js */

// require and instantiate express
var express = require("express");
var app = express();

var port = process.env.PORT || 8080;
var bodyParser = require("body-parser");
var session = require("express-session");
const MongoStore = require("connect-mongo")(session);
var mongoose = require("mongoose");
var flash = require("connect-flash");
var configDB = require("./config/database.js");
const restify = require("express-restify-mongoose");
const router = express.Router();

// configuration ===============================================================
var connection = mongoose.connect(configDB.url); // connect to our database
// use js promise
mongoose.Promise = global.Promise;
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(connection);

var passport = require("passport");
require("./config/passport")(passport);

app.use(express.static("public"));
app.use("/bower_components", express.static("bower_components"));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
  session({
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

// set the view engine to ejs
app.set("view engine", "ejs");

// test routing
require("./routes/prescription.js")(app);
require("./routes/test.js")(app);

/// AUTH ROUTING
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
    successFlash: "Logged in"
  })
);

app.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged out.");
  res.redirect("/");
});
/////

// REST api
// TODO: move below home.js so its secured
var Patient = require("./models/patient");
var Visit = require("./models/visit");
restify.serve(router, Patient);
restify.serve(router, Visit);
app.use(router);

//// Other routing
// homepage first to handle auth redirects correctly
require("./routes/home.js")(app);
require("./routes/addPatient.js")(app);
require("./routes/addVisit.js")(app);
require("./routes/visitSearch.js")(app);
require("./routes/patientSearch.js")(app);
require("./routes/patient.js")(app);
require("./routes/autocomplete.js")(app);

// 404 routing; should always be last
app.use((req, res, next) => {
  res.status(404);
  // respond with html page
  if (req.accepts("html")) {
    res.render("404", { messages: req.flash(), req: req, url: req.url });
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");
});
app.listen(port);

console.log("listening on port " + port);
