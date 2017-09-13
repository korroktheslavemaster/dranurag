var Patient            = require('../models/patient');

module.exports = (app) => {
  // patient search page
  app.get('/patientSearch', (req, res) => {
    res.render('patientSearch', {messages: req.flash(), req:req, patients: undefined})
  })
  // handle search req
  app.post('/patientSearch', (req, res) => {
    // res.render('patientSearch', {messages: req.flash(), req:req})
    searchObj = {}
    if (req.body.patientId) {
      searchObj._id = req.body.patientId
    }
    if (req.body.name) {
      searchObj.name = {$regex: req.body.name, $options: "i"}
    }
    if (req.body.dateOfBirth) {
      searchObj.dateOfBirth =  req.body.dateOfBirth
    }
    Patient.find(searchObj)
    .sort({_id: -1})
    .then((patients) => {
      if (patients.length == 0) {
        req.flash("warning", "No patients found.")
      }
      return patients;
    }).then((patients) => {
      return patients.map((e) => {
        helpText = e.getHelpText()
        e = e.toObject()
        e.helpText = helpText
        return e
      })
    }).catch((err) => {
      req.flash("error", err.message)
      return []
    }).then((patients) => {
      res.render('patientSearch', {messages: req.flash(), req:req, patients: patients})
    })
  })
}