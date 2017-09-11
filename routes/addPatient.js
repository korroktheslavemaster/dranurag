var Patient            = require('../models/patient');
var Visit              = require('../models/visit');

module.exports = (app) => {
  // add patient page
  app.get('/addPatient', (req, res) => {
    res.render('addPatient', {messages: req.flash(), req:req})
  })

  // add patient form submission, also adds a visit
  app.post('/addPatient', (req, res) => {
    // dd/mm/yyyy conversion, now handled client side only
    // req.body.dateOfBirth =  req.body.dateOfBirth.replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
    console.log(req.body)
    new Patient(req.body)
      .save()
      .then((patient) => {
        return Visit.addVisit(req, Patient, Visit, patient.id)
      })
      .then(() => {
        res.redirect('/addPatient')
      })
      .catch((err) => {
        req.flash('error', err.message)
      })
  })
}