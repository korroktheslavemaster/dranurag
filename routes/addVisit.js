var Visit            = require('../models/visit');
var Patient            = require('../models/patient');
module.exports = (app) => {
  // justs an api endpoint for adding a visit
  app.get('/addVisit', (req, res) => {
    if (!req.query.patientId) {
      req.flash("error", "No patient ID given.")
      res.redirect('/patientSearch')
    } else {
      Visit.addVisit(req, Patient, Visit, req.query.patientId)
      .then(()=> {
        res.redirect('patientSearch')
      })
    }
  })


  // add visit page
  // app.get('/addVisit', (req, res) => {
  //   res.render('addVisit', {messages: req.flash(), req:req, investigations: req.query.patientId? ["first in", "second"] : undefined})
  // })

  // // add visit form submission
  // app.post('/addVisit', (req, res) => {
  //   console.log(req.body)
  //   // Patient.create(req.body, (err, patient) => {
  //   //   if (err) {
  //   //     req.flash("error", err.message)
  //   //   } else {
  //   //     req.flash("info", "Added new patient \"" + patient.firstName + "\" with id: <strong>" + patient.id + "</strong>.")
  //   //   }
  //   //   res.redirect('/addVisit')
  //   // })
  //   req.flash("info", "Did nothing.")
  //   res.redirect('/addVisit')
  // })
}