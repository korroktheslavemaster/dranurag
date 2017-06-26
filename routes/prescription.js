var Visit            = require('../models/visit');
var Patient          = require('../models/patient');
var Investigation    = require('../models/investigation');
var Prescription     = require('../models/prescription');

var _ = require('lodash');
var pdf = require('html-pdf');

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

  
  app.get('/prescriptionPdf/:prescriptionId', function(req, res) {
    const {prescriptionId} = req.params
    Prescription.findOne({_id: parseInt(prescriptionId)})
      .populate('patient')
      .then(prescription => {
        if (!prescription) {
          throw {message: "no prescrpitoin"}
        }
        res.render(
          'partials/prescription', 
          {
            messages: req.flash(), 
            req: req, 
            patient: prescription.patient, 
            prescription: prescription, 
            dateformat: dateformat
          }, (err, html) => {
            var options = {
              width: '8.27in',
              height: '11.69in',
              // viewportSize: {
              //   width: 1500,
              //   height: 3000
              // },
              base: process.env.BASE_URL || 'http://localhost:8080',
              // HTTP Headers that are used for requests
              httpHeaders: {
                // e.g.
                "Authorization": "Bearer ACEFAD8C-4B4D-4042-AB30-6C735F5BAC8B",
                'User-Agent': "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0"
              } ,
              footer: {
                height: '150px'
              },
              "border": {
                "top": "1.2in",            // default is 0, units: mm, cm, in, px 
                "right": "0.2in",
                "left": "0.2in"
              },
            };
            console.log('creating pdf...')
            pdf.create(html, options).toBuffer(function(err, buffer) {
              console.log('done.')
              if (err) return console.log(err);
              res.contentType('application/pdf')
              res.end(buffer, 'binary')
              // console.log(res); // { filename: '/app/businesscard.pdf' }
            });
        })
      })
      .catch(err => {
        req.flash('error', err.message)
        res.redirect('/')
      })
  })
}