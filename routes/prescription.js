var Visit            = require('../models/visit');
var Patient          = require('../models/patient');
var Investigation    = require('../models/investigation');
var Prescription     = require('../models/prescription');

var _ = require('lodash');


var dateformat = require('dateformat');


module.exports = (app) => {
  
  // testing prescription
  app.get('/prescription/:prescriptionId', function(req, res) {
    const {prescriptionId} = req.params
    Prescription.findOne({_id: parseInt(prescriptionId)})
      .populate('patient')
      .then(prescription => {
        if (!prescription) {
          throw {message: "no prescrpitoin"}
        }
        res.render('partials/prescription', {messages: req.flash(), req: req, patient: prescription.patient, prescription: prescription, dateformat: dateformat})
      })
      .catch(err => {
        req.flash('error', err.message)
        res.redirect('/')
      })
  })

  

}