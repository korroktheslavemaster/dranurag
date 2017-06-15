var Visit            = require('../models/visit');

module.exports = (app) => {
  // add visit page
  app.get('/addVisit', (req, res) => {
    res.render('addVisit', {messages: req.flash(), req:req, investigations: req.query.patientId? ["first in", "second"] : undefined})
  })

  // add visit form submission
  app.post('/addVisit', (req, res) => {
    console.log(req.body)
    // Patient.create(req.body, (err, patient) => {
    //   if (err) {
    //     req.flash("error", err.message)
    //   } else {
    //     req.flash("info", "Added new patient \"" + patient.firstName + "\" with id: <strong>" + patient.id + "</strong>.")
    //   }
    //   res.redirect('/addVisit')
    // })
    req.flash("info", "Did nothing.")
    res.redirect('/addVisit')
  })
}