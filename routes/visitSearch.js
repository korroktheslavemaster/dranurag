var Visit            = require('../models/visit');
var Patient          = require('../models/patient')
var moment = require("moment")
var _ = require('lodash')

module.exports = (app) => {
  // visit search page
  app.get('/visitSearch', (req, res) => {
    res.render('visitSearch', {messages: req.flash(), req:req, visits: [], moment: moment})
  })
  // // handle search req
  app.post('/visitSearch', (req, res) => {
    day = new Date(req.body.visitDate)
    nextDay = moment(day).add(1, 'days').toDate()
    Visit.find({date: {
      '$gte': day,
      '$lt': nextDay
    }}).sort({date: -1})
    .populate('patient')
    .then((visits) => {
      return _.uniqBy(visits, (e) => (e.patient._id))
    }).then((visits) => {
      return visits.map((e) => {
        helpText = e.patient.getHelpText()
        e = e.toObject()
        e.ago = moment(e.date).fromNow()
        e.helpText = helpText
        return e
      })
    })
    .catch((err) => {
      req.flash("error", err.message)
      return [];
    })
    .then((visits) => {
      if (visits.length == 0) {
        req.flash('warning', 'No visits found.')
        return []
      }
      return visits
    })
    .then((visits) => {
      res.render('visitSearch', { messages: req.flash(), req: req, visits: visits, moment: moment})
    })
  })
}