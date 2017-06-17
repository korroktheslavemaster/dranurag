var moment = require('moment');
var Visit            = require('../models/visit');
var _ = require('lodash');

module.exports = (app) => {
  app.get('/', (req, res) => {
    if (!req.user) {
      res.render('home', { messages: req.flash(), req: req })
      return;
    }
    // find all visits till 6 hours ago
    var d = new Date()
    d.setHours(d.getHours() - 6)
    Visit.find({date: {$gte: d}})
      .sort({date: -1})
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
        res.render('homeWithVisits', { messages: req.flash(), req: req, visits: visits })
      })
  })

  // redirect to home page if not logged in
  app.use((req, res, next) => {
    if (!req.user && req.path != "/") {
      req.flash("error", "Please login first.")
      res.redirect('/')
    } else {
      next()
    }
  })


}