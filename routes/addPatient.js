var Patient            = require('../models/patient');
var Visit              = require('../models/visit');

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function bmi(weightKg, heightCm) {
  if (!weightKg || !heightCm)
    return null
  weightKg = parseInt(weightKg)
  heightCm = parseInt(heightCm)
  ret = parseFloat(weightKg / ((heightCm / 100) * (heightCm / 100))).toFixed(2)
  console.log("bmi is " + ret)
  return ret
}

module.exports = (app) => {
  // add patient page
  app.get('/addPatient', (req, res) => {
    res.render('addPatient', {messages: req.flash(), req:req})
  })

  // add patient form submission, also adds a visit
  app.post('/addPatient', (req, res) => {
    // dd/mm/yyyy conversion, now handled client side only
    // req.body.dateOfBirth =  req.body.dateOfBirth.replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
    req.body.name = toTitleCase(req.body.name)
    req.body.bmi = bmi(req.body.weight, req.body.height)
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