var Visit            = require('../models/visit');
var Patient          = require('../models/patient');
var Investigation    = require('../models/investigation');
var _ = require('lodash');


var dateformat = require('dateformat');
module.exports = (app) => {
  // show patient profile
  app.get('/patient/:patientId', (req, res) => {
    const { patientId } = req.params
    Patient.findOne({_id: parseInt(patientId)})
    .then((patient) => {
      if (!patient) {
        throw {message: "Invalid patient ID."}
      }
      Investigation.aggregate({$match: {patient: {$eq: patient._id}}})
      .then(res => {
        console.log(res)
      })
      res.render('patient', {messages: req.flash(), req: req, patient: patient, helpText: patient.getHelpText(), dateformat: dateformat})
      
    }).catch((err) => {
      req.flash("error", err.message)
      res.redirect('/')
    })
  })

  app.post('/addInvestigation/:patientId', (req, res) => {
    Patient.findOne({_id: parseInt(req.params.patientId)})
    .then((patient) => {
      if (!patient) {
        throw {message: 'Invalid patient ID.'}
      } else {
        const {date, name, units, value} = req.body
        const length = date.length
        const patient = _.times(length, _.constant(req.params.patientId))
        investigations = 
         _.zip(patient, date, name, units, value)
          .filter(elm => elm[2] && elm[4]) // only consider investigations with non-empty name and value
          .map(elm => _.zipObject(['patient', 'date', 'name', 'units', 'value'], elm))
          .map(elm => new Investigation(elm).save())
        return Promise.all(investigations)
          .then(values => {
            req.flash('info', 'Added <strong>' + values.length + '</strong> investigation(s).')
            res.redirect('back')
          })
      }
    }).catch((err) => {
      req.flash("error", err.message)
      res.redirect('/patient/' + req.params.patientId)
    })
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