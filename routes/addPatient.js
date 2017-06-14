var Patient            = require('../models/patient');

module.exports = (app) => {
  // add patient page
  app.get('/addPatient', (req, res) => {
    res.render('addPatient', {messages: req.flash(), req:req})
  })

  // add patient form submission
  app.post('/addPatient', (req, res) => {
    console.log(req.body)
    Patient.create(req.body, (err, patient) => {
      if (err) {
        req.flash("error", err.message)
      } else {
        req.flash("info", "Added new patient \"" + patient.firstName + "\" with id: <strong>" + patient.id + "</strong>.")
      }
      res.redirect('/addPatient')
    })
  })
}